import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Public route — view products
router.get('/', (req, res) => {
  const products = [
    { id: 1, name: 'T-shirt', price: 1200 },
    { id: 2, name: 'Shoes', price: 3500 },
    { id: 3, name: 'Jacket', price: 5400 },
  ];

  res.json({
    message: '🛍️ Public Products List',
    products,
  });
});

// 🔐 Protected route — placing an order (requires login)
router.post('/order', protect, (req, res) => {
  const user = req.user;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: 'Product ID and quantity required' });
  }

  // Dummy response — this will later save to a real Order model
  res.json({
    message: '✅ Order placed successfully',
    user: user.email,
    orderDetails: { productId, quantity },
  });
});

export default router;
