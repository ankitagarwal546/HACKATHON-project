const User = require('../models/User');
const { sendTokenResponse } = require('../middleware/auth');

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, interests: user.interests, preferences: user.preferences },
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const { interests, preferences } = req.body;
    const user = await User.findById(req.user._id);
    if (interests) user.interests = interests;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    await user.save();
    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, interests: user.interests, preferences: user.preferences },
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 1000), httpOnly: true });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
