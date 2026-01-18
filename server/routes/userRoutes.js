import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';

/* ========= Middleware: require admin ========= */
const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.admin = user;
    next();
  } catch (err) {
    console.error('Admin auth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/* ========= GET all users (admin only) ========= */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('GET users error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

/* ========= DELETE user (admin only) ========= */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    // prevent deleting yourself
    if (req.params.id === String(req.admin._id)) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

/* ========= PROMOTE to admin ========= */
router.patch('/:id/make-admin', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User promoted to admin', user });
  } catch (err) {
    console.error('Promote user error:', err);
    res.status(500).json({ message: 'Failed to promote user' });
  }
});

/* ========= DEMOTE to user (optional) ========= */
router.patch('/:id/remove-admin', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'user' },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Admin rights removed', user });
  } catch (err) {
    console.error('Demote user error:', err);
    res.status(500).json({ message: 'Failed to update user role' });
  }
});

export default router;
