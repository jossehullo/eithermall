import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

/* =========================
   IMAGE FILTER
========================= */
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed! (jpg, png, webp, gif)'));
  }
};

/* =========================
   PRODUCT STORAGE
========================= */
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'eithermall/products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

/* =========================
   AVATAR STORAGE
   - Folder: eithermall/avatars
   - Auto resize to 300x300
========================= */
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'eithermall/avatars',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      {
        width: 300,
        height: 300,
        crop: 'fill',
        gravity: 'face',
      },
    ],
  },
});

/* =========================
   EXPORTS
========================= */
export const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFilter,
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
});
