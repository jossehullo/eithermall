import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

/* ============================
   CREATE ORDER (USER)
   POST /orders
   ============================ */
router.post('/', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      items,
      customerName,
      phone,
      county,
      subcounty,
      paymentMethod,
      totalAmount,
      paymentReference,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    /* ============================
       STOCK VALIDATION & DEDUCTION
       ============================ */
    for (const item of items) {
      const productId = item.productId || item._id;

      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new Error('Product not found');
      }

      const requiredStock = item.qty * item.piecesPerUnit;

      if (product.stock < requiredStock) {
        throw new Error(`Insufficient stock for ${product.name} (${item.unitName})`);
      }

      // 🔻 Deduct stock
      product.stock -= requiredStock;
      await product.save({ session });
    }

    /* ============================
       CREATE ORDER
       ============================ */
    const order = await Order.create(
      [
        {
          user: req.user._id,
          items: items.map(i => ({
            productId: i.productId || i._id,
            name: i.name,
            unitName: i.unitName,
            piecesPerUnit: i.piecesPerUnit,
            qty: i.qty,
            unitPrice: i.unitPrice,
            image: i.image,
          })),
          customerName,
          phone,
          county,
          subcounty,
          paymentMethod,
          paymentReference,
          totalAmount,
          status: 'pending',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error('Create order error:', err);
    res.status(400).json({ message: err.message });
  }
});

/* ============================
   USER: MY ORDERS
   GET /orders/my
   ============================ */
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load orders' });
  }
});

/* ============================
   ADMIN: ALL ORDERS
   GET /orders
   ============================ */
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Admin orders error:', err);
    res.status(500).json({ message: 'Failed to load admin orders' });
  }
});

/* ============================
   ADMIN: UPDATE STATUS (LOCKED)
   PATCH /orders/:id/status
   ============================ */
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, paymentReference } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const allowedTransitions = {
      pending: ['paid'],
      paid: ['ready_for_delivery'],
      ready_for_delivery: ['delivered'],
      delivered: [],
    };

    if (!allowedTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    order.status = status;

    if (status === 'paid' && paymentReference) {
      order.paymentReference = paymentReference;
    }

    await order.save();

    res.json(order);
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

/* ============================
   ADMIN DASHBOARD STATS
   GET /orders/admin/stats
   ============================ */
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const paidOrders = orders.filter(o => o.status === 'paid').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

    const totalRevenue = orders
      .filter(o => o.status !== 'pending')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({
      totalOrders,
      pendingOrders,
      paidOrders,
      deliveredOrders,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load stats' });
  }
});

export default router;
