// models/User.js

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name is Required']
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is Required']
  },
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is Required']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  mobileNo: {
    type: String,
    required: [true, 'Mobile Number is Required'],
    validate: {
      validator: v => /^\d{11}$/.test(v),
      message: props => `${props.value} is not a valid 11-digit mobile number`
    }
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', UserSchema)
