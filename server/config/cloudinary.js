// server/config/cloudinary.js

import dotenv from 'dotenv';
dotenv.config(); // ensure env loaded even if imported early

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (process.env.NODE_ENV !== 'production') {
  console.log('Cloudinary configured with:');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('API Key exists:', !!process.env.CLOUDINARY_API_KEY);
}

export default cloudinary;
