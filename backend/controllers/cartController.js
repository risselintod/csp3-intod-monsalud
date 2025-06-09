// controllers/cartController.js

// [SECTION] Dependencies and Modules
const { errorHandler } = require('../auth.js')
const Cart    = require('../models/Cart.js')
const Product = require('../models/Product.js')

// [SECTION] Retrieve Cart
// GET /cart/get-cart
module.exports.getCart = (req, res) => {
  const userId = req.user.id;
  return Cart.findOne({ userId })
    .then(cart => {
      if (cart) {
        return res.status(200).send(cart);
      }
      // create empty cart if none
      const newCart = new Cart({ userId, cartItems: [], totalPrice: 0 });
      return newCart.save().then(c => res.status(200).send(c));
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send({ message: 'Server error' });
    });
}

// [SECTION] Add to Cart
// POST /cart/add-to-cart
module.exports.addToCart = (req, res, next) => {
  if (req.user.isAdmin) {
    return res.status(403).send({ error: 'Action forbidden' })
  }
  const userId = req.user.id
  const { productId, quantity } = req.body

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).send({ message: 'Product not found' })
      }
      const newSubtotal = quantity * product.price
      return Cart.findOne({ userId })
        .then(cart => {
          if (!cart) {
            const newCart = new Cart({
              userId,
              cartItems: [{ productId, quantity, subtotal: newSubtotal }],
              totalPrice: newSubtotal
            })
            return newCart.save()
          }
          const existingItem = cart.cartItems.find(item =>
            item.productId.toString() === productId
          )
          if (existingItem) {
            existingItem.quantity += quantity
            existingItem.subtotal = existingItem.quantity * product.price
          } else {
            cart.cartItems.push({ productId, quantity, subtotal: newSubtotal })
          }
          cart.totalPrice = cart.cartItems.reduce(
            (sum, item) => sum + item.subtotal,
            0
          )
          return cart.save()
        })
    })
    .then(savedCart => {
      if (savedCart) {
        return res.status(200).send({
          message: 'Item added to cart successfully',
          cart: savedCart
        })
      }
    })
    .catch(error => errorHandler(error, req, res))
}

// [SECTION] Remove Item from Cart
// PATCH /cart/:productId/remove-from-cart
module.exports.removeFromCart = (req, res, next) => {
  if (req.user.isAdmin) {
    return res.status(403).send({ error: 'Action forbidden' })
  }
  const userId    = req.user.id
  const { productId } = req.params

  Cart.findOne({ userId })
    .then(cart => {
      if (!cart) {
        return res.status(404).send({ message: 'No cart found for this user' })
      }
      const idx = cart.cartItems.findIndex(
        item => item.productId.toString() === productId
      )
      if (idx === -1) {
        return res.status(404).send({ message: 'Item not found in cart' })
      }

      // remove and capture the removed item
      const removed = cart.cartItems.splice(idx, 1)[0]

      // adjust total
      cart.totalPrice -= removed.subtotal

      // save updated cart
      return cart.save()

    })
    .then(updatedCart => {
      if (updatedCart) {
        return res.status(200).send({
          message: 'Item removed from cart successfully',
          updatedCart: updatedCart
        });
      }
    })
    .catch(error => errorHandler(error, req, res))
}

// [SECTION] Clear Cart
// PUT /cart/clear-cart
module.exports.clearCart = (req, res, next) => {
  if (req.user.isAdmin) {
    return res.status(403).send({ message: 'Action forbidden' })
  }
  return Cart.findOne({ userId: req.user.id })
    .then(cart => {
      if (!cart) {
        return res.status(404).send({ message: 'No cart found for this user' })
      }
      if (cart.cartItems.length === 0) {
        return res.status(400).send({ message: 'Cart is already empty' })
      }
      cart.cartItems = []
      cart.totalPrice = 0
      return cart.save()
    })
    .then(updatedCart => {
      if (updatedCart) {
        return res.status(200).send({
          message: 'Cart cleared successfully',
          cart: updatedCart
        })
      }
    })
    .catch(error => errorHandler(error, req, res))
}

//[SECTION] Update Cart Quantity
// PATCH /cart/update-cart-quantity
module.exports.updateCartQuantity = (req, res) => {
  const userId    = req.user.id
  const { productId, quantity } = req.body

  if (!productId || quantity == null) {
    return res.status(400).send({ message: 'productId and quantity are required' })
  }
  if (quantity < 1) {
    return res.status(400).send({ message: 'Quantity must be at least 1' })
  }

  // 1) load the user's cart
  return Cart.findOne({ userId })
    .then(cart => {
      if (!cart) {
        return res.status(404).send({ message: 'Cart not found' })
      }

      // 2) find the cart item
      const item = cart.cartItems.find(
        ci => ci.productId.toString() === productId
      )
      if (!item) {
        return res.status(404).send({ message: 'Item not in cart' })
      }

      // 3) lookup the product's price
      return Product.findById(productId)
        .then(prod => {
          if (!prod) {
            return res.status(404).send({ message: 'Product not found' })
          }

          // 4) update quantity & subtotal
          item.quantity = quantity
          item.subtotal = quantity * prod.price

          // 5) recompute cart total
          cart.totalPrice = cart.cartItems.reduce(
            (sum, ci) => sum + ci.subtotal,
            0
          )

          // 6) save
          return cart.save()
        })
    })
    .then(updatedCart => {
      if (updatedCart && !res.headersSent) {
        return res.status(200).send({
          message: 'Item quantity updated successfully',
          cart: updatedCart
        })
      }
    })
    .catch(err => errorHandler(err, req, res))
}
