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
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();
    const users = await User.countDocuments();

    res.json({ products, orders, users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

export default router;
