// server/routes/productRoutes.js
import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';

const router = express.Router();

// 🛍️ Get all products (public)
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    message: '🛍️ Public Products List',
    products,
  });
});

// 🛒 Create new product (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
});

export default router;
