// routes/cartRoutes.js

// [SECTION] Dependencies and Modules
const express = require('express')
const cartController = require('../controllers/cartController.js') 
const { verify } = require('../auth.js')

const router = express.Router()

//[SECTION] Retrieve Cart
// GET /cart/get-cart
router.get('/get-cart', verify, cartController.getCart)

//[SECTION] Add to Cart
// POST /cart/add-to-cart
router.post('/add-to-cart', verify, cartController.addToCart)

//[SECTION] Remove from Cart
// PATCH /cart/:productId/remove-from-cart
router.patch('/:productId/remove-from-cart', verify, cartController.removeFromCart)

//[SECTION] Change Product Quantities in Cart
// PATCH /cart/update-cart-quantity
router.patch('/update-cart-quantity', verify, cartController.updateCartQuantity)

//[SECTION] Clear Cart
// PUT /cart/clear-cart
router.put('/clear-cart', verify, cartController.clearCart)

module.exports = router
