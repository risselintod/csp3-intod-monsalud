// routes/orderRoutes.js
const express = require('express')
const { createOrder, getUserOrders, getAllOrders } = require('../controllers/orderController')

const { verify, verifyAdmin } = require('../auth.js')
const router = express.Router()


// router.post('/checkout', verify, createOrder)
// — Create Order (non-admin only) —
router.post('/checkout', verify, createOrder)

router.get('/my-orders', verify, getUserOrders)
router.get('/all-orders', verify, verifyAdmin, getAllOrders)

module.exports = router
