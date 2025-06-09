// routes/productRoutes.js

// [SECTION] Dependencies and Modules
const express = require('express')
const productController = require("../controllers/productController.js");
const { verify, verifyAdmin } = require('../auth.js')

const router = express.Router()

// [SECTION] Create Product
// POST /products
router.post( '/', verify, verifyAdmin, productController.addProduct )

// [SECTION] Retrieve All Products (admin only)
// GET /products/all
router.get( '/all', verify, verifyAdmin, productController.getAllProducts )

// [SECTION] Retrieve All Active Products
// GET /products/active
router.get( '/active', productController.getAllActiveProducts )

// [SECTION] Retrieve Single Product
// GET /products/:productId
router.get( '/:productId', productController.getProduct )

// [SECTION] Update Product Info
// PATCH /products/:productId/update
router.patch( '/:productId/update', verify, verifyAdmin, productController.updateProduct )

// [SECTION] Archive Product
// PATCH /products/:productId/archive
router.patch( '/:productId/archive', verify, verifyAdmin, productController.archiveProduct )

// [SECTION] Activate Product
// PATCH /products/:productId/activate
router.patch( '/:productId/activate', verify, verifyAdmin, productController.activateProduct )

// [SECTION] Search Product by Name
// POST /products/search-by-name
router.post( '/search-by-name', productController.searchProductByName )

// [SECTION] Search Products by Price Range
// POST /products/search-by-price
router.post( '/search-by-price', productController.searchProductsByPrice )

module.exports = router
