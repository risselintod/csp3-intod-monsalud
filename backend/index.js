// index.js

// [SECTION] Dependencies
const express  = require("express")
const mongoose = require("mongoose")
const cors     = require("cors")

// [SECTION] Environment Setup
require("dotenv").config()

// [SECTION] Routes
const userRoutes    = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")
const cartRoutes    = require("./routes/cartRoutes")
const orderRoutes   = require("./routes/orderRoutes")

// [SECTION] Middleware
const { verify, verifyAdmin, errorHandler } = require("./auth.js")

// [SECTION] Server Setup
const app = express()
app.use(express.json())

const corsOptions = {
  origin: ["http://localhost:4000", "http://localhost:8000", "https://dwow4264w2.execute-api.us-west-2.amazonaws.com/production"],
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// [SECTION] Database Connection
mongoose.connect(process.env.MONGODB_STRING)
mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas")
)

// [SECTION] Backend Routes
// User routes
app.use("/users", userRoutes)
// Product routes
app.use("/products", productRoutes)
// Cart routes
app.use("/cart", cartRoutes)
// Order routes
app.use("/orders", orderRoutes)

// [SECTION] Global Error Handler
app.use(errorHandler)

// [SECTION] Start Server
if (require.main === module) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () =>
    console.log(`API is now online on port ${PORT}`)
  )
}

module.exports = { app, mongoose }
