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
    piecesPerUnit: {
      type: Number,
      default: 1,
    },
    qty: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
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
      index: true, // 🔥 faster lookups
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

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
      enum: [
        'pending',
        'paid',
        'ready_for_delivery',
        'delivered',
        'cancelled', // ✅ now valid
      ],
      default: 'pending',
      index: true, // 🔥 improves admin filtering performance
    },

    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
