// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// SERVE STATIC FILES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public'))); // ← Serves placeholder.png, default-avatar.png

// API ROUTES — ORDER MATTERS
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // ← This handles /api/products AND /api/products/:id
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Eithermall API is running...');
});

// 404 handler — MUST BE LAST and without '*' in path
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database + Server Start
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eithermall';

mongoose
  .connect(MONGO)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Uploads folder: ${path.join(__dirname, 'uploads')}`);
      console.log(`Public folder: ${path.join(__dirname, 'public')}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
