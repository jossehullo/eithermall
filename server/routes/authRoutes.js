// server/routes/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

import User from '../models/User.js';
import { uploadAvatar } from '../middleware/upload.js'; // CHANGED: uploadAvatar

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';

/**
 * Build full public URL for avatar.
 * DB stores: "avatars/filename.ext"
 * URL: http://host/uploads/avatars/filename.ext
 */
const buildAvatarUrl = (req, avatarPath) => {
  if (!avatarPath) return null;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const safePath = avatarPath.replace(/\\/g, '/');
  return `${baseUrl}/uploads/${safePath}`;
};

/* REGISTER */
router.post('/register', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    if (!username || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({
      username,
      email,
      phone,
      password,
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* LOGIN */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email & password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatarUrl: buildAvatarUrl(req, user.avatar),
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* PROFILE (GET) */
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const avatarUrl = buildAvatarUrl(req, user.avatar);

    res.status(200).json({
      message: 'Profile fetched successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar, // relative path
        avatarUrl, // full URL
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* PROFILE (UPDATE) */
router.put('/profile', uploadAvatar.single('avatar'), async (req, res) => {
  // CHANGED: uploadAvatar
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username, email, phone } = req.body;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (phone && !/^\+254\d{9}$/.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // New avatar?
    if (req.file) {
      // Delete old
      if (user.avatar) {
        const oldPath = path.join('uploads', user.avatar);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      user.avatar = `avatars/${req.file.filename}`;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    const avatarUrl = buildAvatarUrl(req, user.avatar);

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        avatarUrl,
      },
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* CHANGE PASSWORD */
router.put('/change-password', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    await user.setPassword(newPassword);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
