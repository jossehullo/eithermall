import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';

/* =========================
   ADMIN AUTH MIDDLEWARE
========================= */
const requireAdmin = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/* =========================
   GET USERS
========================= */
router.get('/', requireAdmin, async (_, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json(users);
  } catch {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

/* =========================
   DELETE USER
========================= */
router.delete('/:id', requireAdmin, async (req, res) => {
  if (String(req.admin._id) === req.params.id) {
    return res.status(400).json({ message: 'You cannot delete yourself' });
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ message: 'User deleted' });
});

/* =========================
   PROMOTE TO ADMIN
========================= */
router.patch('/:id/make-admin', requireAdmin, async (req, res) => {
  if (String(req.admin._id) === req.params.id) {
    return res.status(400).json({ message: 'You are already admin' });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: 'admin' },
    { new: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ user });
});

/* =========================
   DEMOTE TO USER
========================= */
router.patch('/:id/remove-admin', requireAdmin, async (req, res) => {
  if (String(req.admin._id) === req.params.id) {
    return res.status(400).json({ message: 'You cannot demote yourself' });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: 'user' },
    { new: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ user });
});

export default router;
