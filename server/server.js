// server/server.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

/* =========================
   DEBUG ENV CHECK (LOCAL ONLY)
========================= */
if (process.env.NODE_ENV !== 'production') {
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', process.env.CLOUDINARY_API_KEY);
  console.log('API Secret exists:', !!process.env.CLOUDINARY_API_SECRET);
}

/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://eithermall.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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

app.get('/', (_, res) => {
  res.send('Eithermall API is running...');
});

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* =========================
   DATABASE CONNECTION + SOCKET SETUP
========================= */

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI missing');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: ['http://localhost:3000', 'https://eithermall.vercel.app'],
      },
    });

    app.set('io', io);

    io.on('connection', socket => {
      console.log('🔌 Admin connected:', socket.id);
    });

    server.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });
