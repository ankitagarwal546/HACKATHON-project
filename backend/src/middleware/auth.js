const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cosmic-watch-secret-change-in-production');
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is invalid or has expired' });
  }
};

exports.generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'cosmic-watch-secret-change-in-production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

exports.sendTokenResponse = (user, statusCode, res) => {
  const token = exports.generateToken(user._id);
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      interests: user.interests,
      preferences: user.preferences,
    },
  });
};
