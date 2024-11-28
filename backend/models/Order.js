import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productImage: [
      {
        type: String,
      },
    ],
    productType: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    allowedPriceEntry: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    quantityUnit: {
      type: String,
      required: true,
    },
    address: {
      lineOne: { type: String, required: true },
      lineTwo: { type: String },
      state: { type: String, required: true },
      district: { type: String, required: true },
      subDistrict: { type: String, required: true },
      village: { type: String, required: true },
      country: { type: String, required: true },
      pincode: { type: String, required: true },  // Changed to String
      location: {
        type: {
          type: String,
          enum: ['Point'], // GeoJSON type must be "Point"
          required: true,
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    pickUpDate: {
      type: Date,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'canceled'],
      default: 'pending',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add a geospatial index on the location field
orderSchema.index({ 'address.location': '2dsphere' });

const Order = mongoose.model('Order', orderSchema);
export default Order;

