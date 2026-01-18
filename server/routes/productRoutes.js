// server/routes/productRoutes.js
import express from 'express';
import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import { uploadProduct } from '../middleware/upload.js';

const router = express.Router();

const buildImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const safePath = imagePath.replace(/\\/g, '/');
  return `${baseUrl}/uploads/${safePath}`;
};

/* GET all products */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    const fixed = products.map(p => ({
      ...p.toObject(),
      imageUrl: buildImageUrl(req, p.image),
    }));
    // debug
    console.log('GET /api/products - returning', fixed.length, 'products');
    res.json(fixed);
  } catch (err) {
    console.error('PRODUCT LIST ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* GET single product */
router.get('/:id', async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(
      `GET /api/products/${req.params.id} - packagingOptions count:`,
      (product.packagingOptions || []).length
    );

    res.json({
      ...product.toObject(),
      imageUrl: buildImageUrl(req, product.image),
    });
  } catch (err) {
    console.error('PRODUCT FETCH SINGLE ERROR:', err);
    res.status(404).json({ message: 'Product not found' });
  }
});

/* CREATE */
router.post('/', uploadProduct.single('image'), async (req, res) => {
  try {
    // Parse packagingOptions (we expect JSON string in multipart/form-data)
    let packagingOptions = [];
    if (req.body.packagingOptions) {
      try {
        packagingOptions = JSON.parse(req.body.packagingOptions);
      } catch (err) {
        console.warn(
          'Invalid packagingOptions JSON, ignoring. raw:',
          req.body.packagingOptions
        );
        packagingOptions = [];
      }
    }

    // log raw so you can debug in server terminal
    console.log(
      'POST /api/products - raw packagingOptions length:',
      packagingOptions.length
    );

    const { name, category, price, stock, description, baseUnitName, defaultSaleUnit } =
      req.body;

    const product = new Product({
      name,
      category,
      price: price ? Number(price) : 0,
      stock: stock ? Number(stock) : 0,
      description,
      baseUnitName: baseUnitName || undefined,
      defaultSaleUnit: defaultSaleUnit || undefined,
      packagingOptions,
      image: req.file ? `products/${req.file.filename}` : null,
    });

    await product.save();

    console.log(
      'Saved product',
      product._id.toString(),
      'packagingOptions count:',
      (product.packagingOptions || []).length
    );

    res.status(201).json({
      ...product.toObject(),
      imageUrl: buildImageUrl(req, product.image),
    });
  } catch (err) {
    console.error('PRODUCT CREATE ERROR:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

/* UPDATE */
router.put('/:id', uploadProduct.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };

    // if packagingOptions is present, parse it
    if (req.body.packagingOptions) {
      try {
        updates.packagingOptions = JSON.parse(req.body.packagingOptions);
      } catch (err) {
        console.warn('Invalid packagingOptions JSON on update, ignoring.');
      }
    }

    if (req.file) updates.image = `products/${req.file.filename}`;

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({
      ...product.toObject(),
      imageUrl: buildImageUrl(req, product.image),
    });
  } catch (err) {
    console.error('PRODUCT UPDATE ERROR:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

/* DELETE */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.image) {
      const imagePath = path.join('uploads', product.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('PRODUCT DELETE ERROR:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

export default router;
