// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Load env FIRST
dotenv.config();

// Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* =========================
   MIDDLEWARE
========================= */

// ✅ FIXED CORS (Authorization header allowed)
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://eithermall.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FILES
========================= */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   API ROUTES
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get('/', (req, res) => {
  res.send('Eithermall API is running...');
});

/* =========================
   404 HANDLER (LAST)
========================= */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* =========================
   DATABASE CONNECTION
========================= */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is missing in .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    mongoose.connection.once('open', () => {
      console.log('📦 Connected to database:', mongoose.connection.name);
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📁 Uploads: ${path.join(__dirname, 'uploads')}`);
      console.log(`📁 Public: ${path.join(__dirname, 'public')}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
