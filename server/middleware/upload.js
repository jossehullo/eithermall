// server/middleware/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// COMMON FILE FILTER (only images)
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

// AVATAR UPLOAD → uploads/avatars/
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '..', 'uploads', 'avatars');
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'avatar-' + unique + path.extname(file.originalname));
  },
});
export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
});

// PRODUCT UPLOAD → uploads/products/
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '..', 'uploads', 'products');
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + unique + path.extname(file.originalname));
  },
});
export const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for products
  fileFilter: imageFilter,
});
