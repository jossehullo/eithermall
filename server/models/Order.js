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

    customerName: String,
    phone: String,
    county: String,
    subcounty: String,

    paymentMethod: {
      type: String,
      enum: ['equity', 'kcb'],
    },

    paymentReference: {
      type: String, // ✅ NEW
      trim: true,
    },

    status: {
      type: String,
      enum: ['pending', 'paid', 'ready_for_delivery', 'delivered'],
      default: 'pending',
    },

    totalAmount: Number,
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
