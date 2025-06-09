// routes/userRoutes.js

// [SECTION] Dependencies and Modules
const express = require('express')
const userController = require('../controllers/userController.js')
const { verify, verifyAdmin } = require('../auth.js')

const router = express.Router()

// [SECTION] User Registration
// POST /users/register
router.post('/register', userController.registerUser)

// [SECTION] User Authentication
// POST /users/login
router.post('/login', userController.loginUser)

// [SECTION] Get User Details
// GET /users/details
router.get('/details', verify, userController.getUserDetails)

// [SECTION] Set As Admin
// PATCH /users/:id/set-as-admin
router.patch('/:id/set-as-admin', verify, verifyAdmin, userController.setAsAdmin)

// [SECTION] Update Password
// PATCH /users/update-password
router.patch('/update-password', verify, userController.updatePassword)

module.exports = router
