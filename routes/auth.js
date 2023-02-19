const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const adminController = require('../controllers/admin');
const User = require('../models/user');

// POST /api/auth/register
// Register a new user
router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject('Email address already in use.');
        }
      }),
    body('password').trim().isLength({ min: 6 }),
  ],
  adminController.createUser
);

// POST /api/auth/login
// Login a user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').trim().notEmpty().withMessage('Please enter your password.'),
  ],
  authController.login
);

module.exports = router;
