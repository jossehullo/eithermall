// server/controllers/userController.js
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

// Fetch a user's profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile (email, phone, avatar)
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Email & phone validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;

    if (req.body.email && !emailRegex.test(req.body.email))
      return res.status(400).json({ message: 'Invalid email format' });

    if (req.body.phone && !phoneRegex.test(req.body.phone))
      return res.status(400).json({ message: 'Invalid phone format' });

    // If uploading a new avatar, delete the old one
    if (req.file) {
      if (user.avatar && fs.existsSync(user.avatar)) {
        fs.unlinkSync(user.avatar);
      }
      user.avatar = req.file.path;
    }

    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
