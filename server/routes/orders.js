const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// POST /api/orders - create order (demo payment)
router.post('/', protect, async (req, res) => {
  try {
    const { items, paymentMethod, paymentDetails } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    // Calculate total from DB prices for security
    let totalPrice = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.isDeleted) continue;
      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity || 1,
        image: product.images[0]?.url || '',
      });
      totalPrice += product.price * (item.quantity || 1);
    }

    const order = await Order.create({
      buyer: req.user._id,
      items: orderItems,
      totalPrice,
      paymentMethod,
      paymentDetails: paymentDetails || {},
      status: 'paid',
    });

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my - buyer's orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
