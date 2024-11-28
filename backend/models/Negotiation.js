import mongoose from 'mongoose';

const negotiationSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['buy', 'counter_offer'], // 'buy' for "Buy at Price", 'counter_offer' for "Make Counter Offer"
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    offerQuantity: {
      type: Number,
      required: true,
    },
    offerQuantityUnit: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    }
  },
  {
    timestamps: true,
  }
);

const Negotiation = mongoose.model('Negotiation', negotiationSchema);
export default Negotiation;

