// server/routes/productRoutes.js
import express from 'express';
import Product from '../models/Product.js';
import { uploadProduct } from '../middleware/upload.js';

const router = express.Router();

/* =========================
   GET ALL PRODUCTS
========================= */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('PRODUCT LIST ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =========================
   GET SINGLE PRODUCT
========================= */
router.get('/:id', async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('PRODUCT FETCH SINGLE ERROR:', err);
    res.status(404).json({ message: 'Product not found' });
  }
});

/* =========================
   CREATE PRODUCT
========================= */
router.post('/', uploadProduct.single('image'), async (req, res) => {
  try {
    console.log('=== CREATE PRODUCT REQUEST ===');
    console.log('Body:', req.body);
    console.log('File:', req.file ? 'present' : 'missing');

    let packagingOptions = [];

    if (req.body.packagingOptions) {
      try {
        packagingOptions = JSON.parse(req.body.packagingOptions);
      } catch (e) {
        console.warn('Failed to parse packagingOptions:', e.message);
      }
    }

    const { name, category, price, stock, description, baseUnitName, defaultSaleUnit } =
      req.body;

    let imageUrl = null;

    // ✅ CloudinaryStorage returns FULL URL in req.file.path
    if (req.file) {
      imageUrl = req.file.path;
      console.log('Image uploaded successfully:', imageUrl);
    }

    const product = new Product({
      name,
      category,
      price: price ? Number(price) : 0,
      stock: stock ? Number(stock) : 0,
      description,
      baseUnitName: baseUnitName || undefined,
      defaultSaleUnit: defaultSaleUnit || undefined,
      packagingOptions,
      image: imageUrl,
    });

    await product.save();

    console.log('Product created:', product._id);

    res.status(201).json(product);
  } catch (err) {
    console.error('PRODUCT CREATE ERROR:', err.stack || err);
    res.status(500).json({
      message: err.message || 'Server error during product creation',
    });
  }
});

/* =========================
   UPDATE PRODUCT
========================= */
router.put('/:id', uploadProduct.single('image'), async (req, res) => {
  try {
    console.log('=== UPDATE PRODUCT REQUEST ===');
    console.log('Params ID:', req.params.id);
    console.log('File:', req.file ? 'present' : 'missing');

    const updates = { ...req.body };

    if (req.body.packagingOptions) {
      try {
        updates.packagingOptions = JSON.parse(req.body.packagingOptions);
      } catch (e) {
        console.warn('Failed to parse packagingOptions on update:', e.message);
      }
    }

    // ✅ If new image uploaded, replace it
    if (req.file) {
      updates.image = req.file.path;
      console.log('New image uploaded:', req.file.path);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Product updated:', product._id);

    res.json(product);
  } catch (err) {
    console.error('PRODUCT UPDATE ERROR:', err.stack || err);
    res.status(500).json({
      message: err.message || 'Server error during product update',
    });
  }
});

/* =========================
   DELETE PRODUCT
========================= */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('PRODUCT DELETE ERROR:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

export default router;
