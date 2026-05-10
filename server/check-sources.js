const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const products = await Product.find({ isDeleted: false }).lean();
  console.log('Total products:', products.length);
  let hasUnsplash = 0, hasPlacehold = 0, hasCloudinary = 0, other = 0;
  products.forEach(p => {
    const url = p.images?.[0]?.url || '';
    if (url.includes('unsplash.com')) hasUnsplash++;
    else if (url.includes('placehold.co')) hasPlacehold++;
    else if (url.includes('res.cloudinary.com')) hasCloudinary++;
    else other++;
  });
  console.log('Unsplash:', hasUnsplash);
  console.log('Placehold.co:', hasPlacehold);
  console.log('Cloudinary:', hasCloudinary);
  console.log('Other:', other);
  await mongoose.disconnect();
}
check().catch(console.error);
