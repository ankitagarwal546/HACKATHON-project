const Watchlist = require('../models/Watchlist');

exports.getWatchlist = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user._id }).sort({ addedAt: -1 });
    res.status(200).json({ success: true, count: watchlist.length, watchlist });
  } catch (error) {
    next(error);
  }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    const { asteroidId, asteroidName, asteroidData, notes } = req.body;
    const existing = await Watchlist.findOne({ userId: req.user._id, asteroidId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Asteroid already in watchlist' });
    }
    const watchlistItem = await Watchlist.create({
      userId: req.user._id,
      asteroidId,
      asteroidName: asteroidName || asteroidId,
      asteroidData: asteroidData || {},
      notes,
    });
    res.status(201).json({ success: true, watchlistItem });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const watchlistItem = await Watchlist.findById(req.params.id);
    if (!watchlistItem) {
      return res.status(404).json({ success: false, message: 'Watchlist item not found' });
    }
    if (watchlistItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
    }
    await watchlistItem.deleteOne();
    res.status(200).json({ success: true, message: 'Removed from watchlist' });
  } catch (error) {
    next(error);
  }
};

exports.updateWatchlistItem = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const watchlistItem = await Watchlist.findById(req.params.id);
    if (!watchlistItem) {
      return res.status(404).json({ success: false, message: 'Watchlist item not found' });
    }
    if (watchlistItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this item' });
    }
    watchlistItem.notes = notes;
    await watchlistItem.save();
    res.status(200).json({ success: true, watchlistItem });
  } catch (error) {
    next(error);
  }
};
