// models/Order.js

const mongoose = require('mongoose')

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is Required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is Required'],
    min: [1, 'Quantity must be at least 1']
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is Required'],
    min: [0, 'Subtotal must be a positive number']
  }
})

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is Required']
  },
  productsOrdered: {
    type: [OrderItemSchema],
    validate: {
      validator: arr => Array.isArray(arr) && arr.length > 0,
      message: 'There must be at least one ordered product'
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is Required'],
    min: [0, 'Total price must be a positive number']
  },
  orderedOn: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  }
}, {
  timestamps: false
})

module.exports = mongoose.model('Order', OrderSchema)
