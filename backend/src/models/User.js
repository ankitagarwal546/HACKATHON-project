const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'] },
  password: { type: String, required: true, minlength: 6, select: false },
  interests: { type: [String], default: [] },
  preferences: {
    riskThreshold: { type: String, enum: ['low', 'medium', 'high', 'all'], default: 'all' },
    notificationsEnabled: { type: Boolean, default: true },
  },
  viewedAsteroids: [{ asteroidId: String, viewedAt: Date }],
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
