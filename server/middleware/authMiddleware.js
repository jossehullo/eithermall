// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // ✅ Check for Authorization header with Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token using your secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info (without password)
      req.user = await User.findById(decoded.id).select('-password');

      return next();
    } catch (error) {
      console.error('Token validation error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
