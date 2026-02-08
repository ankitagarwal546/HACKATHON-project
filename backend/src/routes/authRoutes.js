const express = require('express');
const router = express.Router();
const { signup, login, getMe, updatePreferences, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { signupValidation, loginValidation, validate } = require('../middleware/validation');

router.post('/signup', signupValidation, validate, signup);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/preferences', protect, updatePreferences);
router.post('/logout', protect, logout);

module.exports = router;
