// controllers/userController.js

// [SECTION] Dependencies and Modules
const bcrypt = require("bcryptjs");
const auth = require('../auth.js')
const User = require('../models/User.js')
const { errorHandler } = require('../auth.js')

// [SECTION] Check if the email already exists
// GET /users/check-email
module.exports.checkEmailExists = (req, res) => {
  if (!req.body.email.includes('@')) {
    return res.status(400).send({ message: 'Invalid email format' })
  }

  return User.find({ email: req.body.email })
    .then(result => {
      if (result.length > 0) {
        return res.status(409).send({ message: 'Duplicate email found' })
      }
      return res.status(404).send({ message: 'No email found' })
    })
    .catch(err => errorHandler(err, req, res))
}

// [SECTION] User Registration
// POST /users/register
module.exports.registerUser = (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName:  req.body.lastName,
    email:     req.body.email,
    mobileNo:  req.body.mobileNo,
    password:  bcrypt.hashSync(req.body.password, 10)
  })

  if (!newUser.firstName || !newUser.lastName) {
    return res.status(400).send({ error: "Please enter your complete name" })
  } else if (!newUser.email || !newUser.email.includes("@")) {
    return res.status(400).send({ error: "Email invalid" })
  } else if (!req.body.password || req.body.password.length < 8) {
    return res.status(400).send({ error: "Password must be at least 8 characters" })
  } else if (!newUser.mobileNo || newUser.mobileNo.length !== 11) {
    return res.status(400).send({ error: "Mobile number invalid" })
  } else {
    return newUser
      .save()
      .then(result => res.status(201).send({ message: "Registered Successfully" }))
      .catch(error => errorHandler(error, req, res))
  }
}

// [SECTION] User Login
// POST /users/login
module.exports.loginUser = (req, res) => {
  if (!req.body.email.includes("@")) {
    return res.status(400).send({ message: "Invalid Email" })
  }

  return User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "No Email Found" })
      }
      const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password)
      if (!isPasswordCorrect) {
        return res.status(401).send({ message: "Email and password do not match" })
      }
      return res
        .status(200)
        .send({
          message: "User logged in successfully",
          access: auth.createAccessToken(user)
        })
    })
    .catch(error => errorHandler(error, req, res))
}

// [SECTION] Get User Details
// GET /users/details
module.exports.getUserDetails = (req, res) => {
  return User.findById(req.user.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User not found" })
      }
      user.password = ""
      return res.status(200).send(user)
    })
    .catch(error => errorHandler(error, req, res))
}

// [SECTION] Set As Admin
// PATCH /users/:id/set-as-admin
module.exports.setAsAdmin = (req, res) => {
  // allow only admins
  if (!req.user.isAdmin) {
    return res.status(403).send({ error: "Access denied. Admins only." })
  }

  return User.findByIdAndUpdate(
    req.params.id,
    { isAdmin: true },
    { new: true }
  )
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).send({ error: "User not found" })
      }
      return res.status(200).send(updatedUser)
    })
    .catch(error => errorHandler(error, req, res))
}

// [SECTION] Update Password
// PATCH /users/update-password
module.exports.updatePassword = (req, res) => {
  const { newPassword } = req.body

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).send({ error: "Password must be at least 8 characters" })
  }

  return User.findById(req.user.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ error: "User not found" })
      }
      return bcrypt
        .hash(newPassword, 10)
        .then(hashed => {
          user.password = hashed
          return user.save()
        })
    })
    .then(() => res.status(200).send({ message: "Password reset successfully" }))
    .catch(error => errorHandler(error, req, res))
}
