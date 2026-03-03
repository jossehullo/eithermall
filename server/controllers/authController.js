// server/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/* ===================== REGISTER ===================== */
export const registerUser = async (req, res) => {
  try {
    let { username, email, password, phone } = req.body;

    // Basic required validation
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Clean phone (remove spaces)
    phone = phone.replace(/\s+/g, '');

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user (password hashed automatically via pre-save hook)
    const user = await User.create({
      username,
      email,
      password,
      phone,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Register Error:', error);

    /* ===== MONGOOSE VALIDATION ERRORS ===== */
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: messages[0], // send first validation message
      });
    }

    /* ===== DUPLICATE EMAIL ERROR ===== */
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email already registered',
      });
    }

    /* ===== FALLBACK ===== */
    return res.status(500).json({
      message: 'Server error',
    });
  }
};

/* ===================== LOGIN ===================== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
};
