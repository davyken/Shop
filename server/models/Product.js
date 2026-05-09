const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ url: String, publicId: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    status: {
      type: String,
      enum: ['available', 'finished', 'in_stock'],
      default: 'available',
    },
    stockCount: { type: Number, default: 0, min: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
