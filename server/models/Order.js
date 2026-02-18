// server/models/Order.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    name: String,
    unitName: String,
    piecesPerUnit: Number,
    qty: Number,
    unitPrice: Number,
    image: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    items: [orderItemSchema],

    customerName: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    county: {
      type: String,
      trim: true,
    },

    subcounty: {
      type: String,
      trim: true,
    },

    // ✅ NEW FIELD ADDED
    area: {
      type: String,
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: ['equity', 'kcb'],
    },

    paymentReference: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ['pending', 'paid', 'ready_for_delivery', 'delivered'],
      default: 'pending',
    },

    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
