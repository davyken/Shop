const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/categories
router.post('/', protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) return res.json({ category: existing });
    const category = await Category.create({ name, createdBy: req.user._id });
    res.status(201).json({ category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
