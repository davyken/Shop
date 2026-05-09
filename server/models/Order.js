const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        title: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        image: String,
      },
    ],
    totalPrice: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['visa', 'orange', 'momo', 'stripe'],
      required: true,
    },
    paymentDetails: { type: Object, default: {} },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'paid',
    },
    orderNumber: { type: String, unique: true },
  },
  { timestamps: true }
);

// Generate order number before save
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'BB-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
