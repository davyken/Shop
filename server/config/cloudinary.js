const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'blessing-babyshop/profiles', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'blessing-babyshop/products', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});

const uploadProfile = multer({ storage: profileStorage, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadProduct = multer({ storage: productStorage, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = { cloudinary, uploadProfile, uploadProduct };
