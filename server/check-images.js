const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const all = await Product.find({ isDeleted: false }).lean();
  console.log('Total products:', all.length);
  all.forEach((p, i) => {
    const url = p.images?.[0]?.url || '';
    const type = url.includes('placehold.co') ? 'placeholder' : 
                 url.includes('cloudinary') ? 'cloudinary' : 
                 url.includes('http') ? 'external' : 'other';
    console.log(`${i+1}. ${p.title} -> [${type}] ${url.substring(0, 80)}`);
  });
  await mongoose.disconnect();
}
check().catch(console.error);
