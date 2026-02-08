const nasaService = require('../services/nasaService');
const User = require('../models/User');

exports.getFeed = async (req, res, next) => {
  try {
    const { start_date, end_date, page = 0, size = 20, risk_level } = req.query;

    if (start_date && end_date) {
      const data = await nasaService.getFeed(start_date, end_date);
      const asteroids = [];
      const neo = data.near_earth_objects || {};
      Object.keys(neo).forEach((date) => {
        (neo[date] || []).forEach((a) => asteroids.push(nasaService.enrichAsteroidData(a)));
      });
      let filtered = asteroids;
      if (risk_level) {
        const level = risk_level.toLowerCase();
        filtered = asteroids.filter((a) => {
          const l = a.risk_analysis?.level;
          if (level === 'high') return l === 'high' || l === 'critical';
          return l === level;
        });
      }
      return res.status(200).json({ success: true, count: filtered.length, asteroids: filtered });
    }

    const pageNum = parseInt(page, 10);
    const sizeNum = parseInt(size, 10);
    const level = risk_level?.toLowerCase();

    let enrichedAsteroids;
    let pageInfo;
    const PAGES_PER_FILTER = 5;
    if (level) {
      const allAsteroids = [];
      for (let p = pageNum * PAGES_PER_FILTER; p < pageNum * PAGES_PER_FILTER + PAGES_PER_FILTER; p++) {
        const data = await nasaService.browseNEOs(p, sizeNum);
        const neo = data.near_earth_objects || [];
        allAsteroids.push(...neo);
        pageInfo = data.page;
        if (neo.length < sizeNum) break;
      }
      enrichedAsteroids = allAsteroids.map((a) => nasaService.enrichAsteroidData(a));
    } else {
      const data = await nasaService.browseNEOs(pageNum, sizeNum);
      enrichedAsteroids = (data.near_earth_objects || []).map((a) => nasaService.enrichAsteroidData(a));
      pageInfo = data.page;
    }

    let filtered = enrichedAsteroids;
    if (level) {
      filtered = enrichedAsteroids.filter((a) => {
        const l = a.risk_analysis?.level;
        if (level === 'high') return l === 'high' || l === 'critical';
        return l === level;
      });
      filtered = filtered.slice(0, sizeNum);
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      page: pageNum,
      totalPages: level ? Math.max(1, Math.ceil((pageInfo?.total_pages ?? 1) / PAGES_PER_FILTER)) : (pageInfo?.total_pages ?? 1),
      totalElements: level ? filtered.length : (pageInfo?.total_elements ?? filtered.length),
      asteroids: filtered,
      links: {},
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const err = new Error(error.message || 'Failed to load asteroid feed');
    err.statusCode = statusCode;
    next(err);
  }
};

exports.lookupAsteroid = async (req, res, next) => {
  try {
    const { asteroidId } = req.params;
    const asteroid = await nasaService.getAsteroidById(asteroidId);
    const enrichedData = nasaService.enrichAsteroidData(asteroid);
    await User.findByIdAndUpdate(req.user._id, {
      $push: { viewedAsteroids: { asteroidId, viewedAt: new Date() } },
    });
    res.status(200).json({ success: true, asteroid: enrichedData });
  } catch (error) {
    if (error.message === 'Asteroid not found') {
      return res.status(404).json({ success: false, message: 'Asteroid not found' });
    }
    next(error);
  }
};

exports.clearCache = async (req, res) => {
  nasaService.clearCache();
  res.status(200).json({ success: true, message: 'Cache cleared successfully' });
};

const LUNAR_KM = 384400;

/**
 * Public stats for landing page (no auth).
 * Returns total NEOs, hazardous count in next 7 days, closest approach in LD.
 */
exports.getStats = async (req, res, next) => {
  try {
    const [browseData, feedData] = await Promise.all([
      nasaService.browseNEOs(0, 1),
      (() => {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 7);
        const startStr = start.toISOString().slice(0, 10);
        const endStr = end.toISOString().slice(0, 10);
        return nasaService.getFeed(startStr, endStr).catch(() => ({ near_earth_objects: {} }));
      })(),
    ]);
    const totalNEOs = browseData.page?.total_elements ?? 0;
    const neo = feedData.near_earth_objects || {};
    let hazardousCount = 0;
    let closestLD = null;
    Object.keys(neo).forEach((date) => {
      (neo[date] || []).forEach((a) => {
        if (a.is_potentially_hazardous_asteroid) hazardousCount += 1;
        const closeApproach = a.close_approach_data?.[0];
        const km = closeApproach?.miss_distance?.kilometers;
        if (km != null) {
          const ld = parseFloat(km) / LUNAR_KM;
          if (closestLD == null || ld < closestLD) closestLD = ld;
        }
      });
    });
    const io = req.app.get('io');
    const socketCount = io?.engine?.clientsCount ?? 0;
    res.status(200).json({
      success: true,
      totalNEOs,
      hazardousCount,
      closestApproachLD: closestLD != null ? Math.round(closestLD * 10) / 10 : null,
      socketCount,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const err = new Error(error.message || 'Failed to load stats');
    err.statusCode = statusCode;
    next(err);
  }
};
