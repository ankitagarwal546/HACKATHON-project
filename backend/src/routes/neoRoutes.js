const express = require('express');
const router = express.Router();
const { getFeed, lookupAsteroid, clearCache, getStats } = require('../controllers/neoController');
const { hypotheticalHit } = require('../controllers/hypotheticalController');
const { protect } = require('../middleware/auth');

router.get('/stats', getStats);
router.get('/feed', protect, getFeed);
router.get('/lookup/:asteroidId', protect, lookupAsteroid);
router.post('/cache/clear', protect, clearCache);
router.post('/hypothetical-hit', protect, hypotheticalHit);

module.exports = router;
