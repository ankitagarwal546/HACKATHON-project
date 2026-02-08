const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  asteroidId: { type: String, required: true },
  asteroidName: { type: String, required: true },
  asteroidData: { type: mongoose.Schema.Types.Mixed, required: true },
  notes: { type: String, maxlength: 500 },
  addedAt: { type: Date, default: Date.now },
});

watchlistSchema.index({ userId: 1, asteroidId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
