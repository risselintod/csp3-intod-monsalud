// controllers/orderController.js

//[SECTION] Dependencies and Modules
const Order = require("../models/Order.js");
const Cart  = require("../models/Cart.js");
const { errorHandler } = require("../auth.js");

//[SECTION] Create Order (Checkout)
// POST /orders/checkout
module.exports.createOrder = (req, res) => {
  const userId = req.user.id
  
  // 1. Block admins from checking out
   if (req.user.isAdmin) {
     return res.status(403).send({ error: "Admins cannot place orders" });
   }

  let savedOrder

  return Cart.findOne({ userId })
    .then(cart => {
      if (!cart || !cart.cartItems.length) {
        // No items to checkout
        return res.status(400).send({ error: 'No Items to Checkout' })
      }
      return new Order({
        userId,
        productsOrdered: cart.cartItems,
        totalPrice: cart.totalPrice
      }).save()
    })
    .then(order => {
      savedOrder = order
      // clear the cart
      return Cart.findOneAndUpdate(
        { userId },
        { cartItems: [], totalPrice: 0 },
        { new: true }
      )
    })
    .then(() => {
      // Success shape
      return res.status(201).send({ message: 'Ordered Successfully' })
    })
    .catch(err => {
      console.error(err)
      return errorHandler(err, req, res)
    })
}

//[SECTION] Retrieve Authenticated User’s Orders
// GET /orders/my-orders
module.exports.getUserOrders = (req, res) => {
  const userId = req.user.id
  return Order.find({ userId })
    .then(orders => {
      // Wrapped per spec
      return res.status(200).send({ orders })
    })
    .catch(err => {
      console.error(err)
      return errorHandler(err, req, res)
    })
}


//[SECTION] Retrieve All Orders (Admin only)
// GET /orders/all-orders
module.exports.getAllOrders = (req, res) => {
  return Order.find()
    .then(orders => {
      // Wrapped per spec
      return res.status(200).send({ orders })
    })
    .catch(err => {
      console.error(err)
      return errorHandler(err, req, res)
    })
}