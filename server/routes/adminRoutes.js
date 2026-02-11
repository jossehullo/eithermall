// server/routes/adminRoutes.js
import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminOnly.js';

const router = express.Router();

// ✅ Admin access test
router.get('/check', protect, adminOnly, (req, res) => {
  res.json({ message: 'Admin access confirmed', admin: req.user });
});

// ✅ Admin dashboard stats (REQUIRED)
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const paidOrders = await Order.countDocuments({ status: 'paid' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    const revenueData = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    res.json({
      totalOrders,
      pendingOrders,
      paidOrders,
      deliveredOrders,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

export default router;
