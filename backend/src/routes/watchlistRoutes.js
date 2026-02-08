const express = require('express');
const router = express.Router();
const { getWatchlist, addToWatchlist, removeFromWatchlist, updateWatchlistItem } = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');
const { watchlistValidation, validate } = require('../middleware/validation');

router.get('/', protect, getWatchlist);
router.post('/', protect, watchlistValidation, validate, addToWatchlist);
router.delete('/:id', protect, removeFromWatchlist);
router.put('/:id', protect, updateWatchlistItem);

module.exports = router;
