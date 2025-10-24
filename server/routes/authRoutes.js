// server/routes/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';

/* ========== REGISTER ========== */
router.post('/register', async (req, res) => {
  try {
    const { name, email: rawEmail, password } = req.body || {};

    // tolerate inputs sent as objects by mistake
    const email =
      typeof rawEmail === 'object' && rawEmail?.email
        ? String(rawEmail.email)
        : String(rawEmail || '').trim();

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    const user = new User({ name, email, password });
    await user.save();

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/* ========== CREATE PERMANENT ADMIN (dev only) ========== */
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password, secret } = req.body || {};
    if (secret !== (process.env.ADMIN_CREATION_SECRET || 'yourDevSecretHere')) {
      return res.status(403).json({ message: 'Invalid admin creation secret' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'Admin with this email already exists' });

    const admin = new User({ name, email, password, role: 'admin' });
    await admin.save();

    return res.status(201).json({
      message: 'Admin registered successfully',
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    console.error('Admin Registration Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/* ========== LOGIN ========== */
router.post('/login', async (req, res) => {
  try {
    let { email: rawEmail, password } = req.body || {};

    // Protect: ensure email is a string (coerce if UI accidentally sends object)
    if (!rawEmail || !password) {
      return res.status(400).json({ message: 'Email & Password are required' });
    }

    const email =
      typeof rawEmail === 'object' && rawEmail?.email
        ? String(rawEmail.email)
        : String(rawEmail).trim();

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    // sanitize user before sending
    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json({ message: 'Login successful', token, user: userSafe });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

/* ========== PROFILE (protected inline for simplicity) ========== */
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ message: 'Profile fetched successfully', user });
  } catch (error) {
    console.error('Profile Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
