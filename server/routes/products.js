const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { uploadProduct, cloudinary } = require('../config/cloudinary');

// GET /api/products - list all (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, status, search, page = 1, limit = 12, sort = 'newest' } = req.query;
    const query = { isDeleted: false };
    if (category) query.category = category;
    if (status) query.status = status;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) query.$text = { $search: search };

    // Determine sort options
    let sortOptions = { createdAt: -1 }; // default: newest first
    if (sort === 'price-low') sortOptions = { price: 1 };
    else if (sort === 'price-high') sortOptions = { price: -1 };
    else if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('seller', 'name username profilePic')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/my - seller's own products
router.get('/my', protect, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id, isDeleted: false })
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('seller', 'name username profilePic');
    if (!product || product.isDeleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products
router.post('/', protect, uploadProduct.array('images', 5), async (req, res) => {
  try {
    const { title, description, price, category, status, stockCount } = req.body;
    const images = (req.files || []).map((f) => ({ url: f.path, publicId: f.filename }));
    const product = await Product.create({
      title, description, price: Number(price), category, status, stockCount: Number(stockCount) || 0,
      images, seller: req.user._id,
    });
    const populated = await product.populate(['category', 'seller']);
    res.status(201).json({ product: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', protect, uploadProduct.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.isDeleted) return res.status(404).json({ message: 'Not found' });
    if (product.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const { title, description, price, category, status, stockCount, removeImages } = req.body;
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (category) product.category = category;
    if (status) product.status = status;
    if (stockCount !== undefined) product.stockCount = Number(stockCount);

    // Remove images if requested
    if (removeImages) {
      const toRemove = JSON.parse(removeImages);
      for (const pubId of toRemove) {
        await cloudinary.uploader.destroy(pubId).catch(() => {});
        product.images = product.images.filter((img) => img.publicId !== pubId);
      }
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
      product.images.push(...newImages);
    }

    await product.save();
    const populated = await product.populate(['category', 'seller']);
    res.json({ product: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    if (product.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    product.isDeleted = true;
    await product.save();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
