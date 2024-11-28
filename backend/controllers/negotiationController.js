// controllers/negotiationController.js
import mongoose from 'mongoose';
import Negotiation from '../models/Negotiation.js';
import Notification from '../models/Notification.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Start a negotiation
export const startNegotiation = async (req, res) => {
  const { orderId, buyerId, offerPrice, offerQuantity, offerQuantityUnit, password } = req.body;

  if (!orderId || !buyerId || !offerPrice || !offerQuantity || !offerQuantityUnit || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findById(buyerId);
    if (!user) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const sellerId = order.seller;
    const negotiationType = order.price === offerPrice ? 'buy' : 'counter';

    const negotiation = new Negotiation({
      order: orderId,
      buyer: buyerId,
      type: negotiationType,
      offerPrice,
      offerQuantity,
      offerQuantityUnit,
    });

    const newNotification = new Notification({
      from: buyerId,
      to: sellerId,
      type: negotiationType,
      order: orderId,
    });

    await negotiation.save();
    await newNotification.save();

    res.status(201).json(negotiation);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
};



// Get negotiations for a specific order
export const getNegotiationsByOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const negotiations = await Negotiation.find({ order: orderId });
    res.json(negotiations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update negotiation status
export const updateNegotiation = async (req, res) => {
  const { negotiationId } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const negotiation = await Negotiation.findById(negotiationId).session(session);
    if (!negotiation) {
      return res.status(404).json({ message: 'Negotiation not found' });
    }

    const order = await Order.findById(negotiation.order).session(session);
    if (!order) {
      return res.status(404).json({ message: 'Order associated with this negotiation not found' });
    }

    // Prevent multiple negotiations from being accepted for the same order
    if (status === 'accepted') {
      const existingAccepted = await Negotiation.findOne({
        order: negotiation.order,
        status: 'accepted',
      }).session(session);

      if (existingAccepted) {
        return res.status(400).json({
          message: 'Another negotiation for this order has already been accepted',
        });
      }

      order.status = 'completed'; // Mark the order as completed if this negotiation is accepted
    }

    negotiation.status = status;

    const newNotification = new Notification({
      from: order.seller,
      to: negotiation.buyer,
      type: status,
      order: negotiation.order,
    });

    // Save all changes
    await negotiation.save({ session });
    await order.save({ session });
    await newNotification.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Negotiation updated successfully', negotiation });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
