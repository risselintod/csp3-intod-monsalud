// models/Cart.js

const mongoose = require('mongoose')

const CartItemSchema = new mongoose.Schema({
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

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  cartItems: {
    type: [CartItemSchema],
    validate: {
      validator: arr => Array.isArray(arr),
      message: 'cartItems must be an array'
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is Required'],
    min: [0, 'Total price must be a positive number'],
    default: 0
  },
  orderedOn: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
})

module.exports = mongoose.model('updatedCart', CartSchema)
