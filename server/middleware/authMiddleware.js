// server/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';

/**
 * ✅ verifyToken — (legacy alias for backward compatibility)
 * Used in userRoutes.js
 */
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('verifyToken error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

/**
 * ✅ protect — identical to verifyToken for use in productRoutes.js
 */
export const protect = verifyToken;

/**
 * ✅ adminOnly — restricts access to admins only
 */
export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({ message: 'Server error validating admin access' });
  }
};

/**
 * ✅ validateUserAccess — ensures users can only modify their own data unless admin
 */
export const validateUserAccess = (req, res, next) => {
  try {
    if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) {
      return next();
    }
    return res
      .status(403)
      .json({ message: 'Access denied: Not authorized for this action' });
  } catch (error) {
    console.error('User access validation error:', error);
    return res.status(500).json({ message: 'Server error validating user access' });
  }
};
