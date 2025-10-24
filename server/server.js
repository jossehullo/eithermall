// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Eithermall API is running...');
});

// Connect to MongoDB and start server
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eithermall';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO)
  .then(() => {
    console.log('MongoDB Connected:', MONGO.split('/').pop());
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
