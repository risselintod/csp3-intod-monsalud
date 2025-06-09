// models/Product.js

const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is Required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is Required'],
    min: [0, 'Price must be a positive number']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' }
})

module.exports = mongoose.model('Product', ProductSchema)
