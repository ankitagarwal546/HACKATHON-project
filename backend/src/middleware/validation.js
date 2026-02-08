const { body, validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

exports.signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

exports.loginValidation = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.watchlistValidation = [
  body('asteroidId').trim().notEmpty().withMessage('Asteroid ID is required'),
  body('asteroidName').trim().notEmpty().withMessage('Asteroid name is required'),
  body('asteroidData').notEmpty().withMessage('Asteroid data is required').isObject().withMessage('Asteroid data must be an object'),
];
