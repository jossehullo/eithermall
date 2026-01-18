import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminOnly.js';

const router = express.Router();

// Test route
router.get('/check', protect, adminOnly, (req, res) => {
  res.json({ message: 'Admin access confirmed', admin: req.user });
});

export default router;
