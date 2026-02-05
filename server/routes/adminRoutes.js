import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminOnly.js';

const router = express.Router();

/* =====================
   ADMIN CHECK
===================== */
router.get('/check', protect, adminOnly, (req, res) => {
  res.json({ message: 'Admin access confirmed', admin: req.user });
});

/* =====================
   ADMIN STATS ✅
===================== */
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [products, users, orders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
    ]);

    res.json({
      products,
      users,
      orders,
    });
  } catch (err) {
    console.error('[ADMIN STATS ERROR]', err);
    res.status(500).json({ message: 'Failed to load dashboard stats' });
  }
});

export default router;
