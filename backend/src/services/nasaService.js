const axios = require('axios');

class NASAService {
  constructor() {
    this.apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    this.baseURL = process.env.NASA_API_BASE_URL || 'https://api.nasa.gov/neo/rest/v1';
    this.cache = new Map();
    this.cacheDuration = 3600000;
  }

  getCacheKey(endpoint, params) {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  isCacheValid(cacheEntry) {
    return cacheEntry && Date.now() - cacheEntry.timestamp < this.cacheDuration;
  }

  async getOrFetch(endpoint, params = {}) {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.cache.get(cacheKey);
    if (this.isCacheValid(cached)) return cached.data;
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params: { ...params, api_key: this.apiKey },
        timeout: 15000,
        validateStatus: (status) => status === 200,
      });
      const data = response.data;
      if (data && data.error_message) {
        const e = new Error(data.error_message);
        e.statusCode = 502;
        throw e;
      }
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.error_message || err.message;
        const e = new Error(
          status === 429
            ? 'NASA API rate limit exceeded. Get a free key at https://api.nasa.gov and set NASA_API_KEY in backend .env'
            : msg
        );
        e.statusCode = status === 429 ? 429 : 502;
        throw e;
      }
      const e = new Error(err.message || 'NASA API unavailable');
      e.statusCode = 502;
      throw e;
    }
  }

  async getFeed(startDate, endDate) {
    const data = await this.getOrFetch('/feed', { start_date: startDate, end_date: endDate });
    return data;
  }

  async getAsteroidById(asteroidId) {
    try {
      return await this.getOrFetch(`/neo/${asteroidId}`);
    } catch (error) {
      if (error.response?.status === 404) throw new Error('Asteroid not found');
      throw new Error(error.response?.data?.error_message || error.message);
    }
  }

  async browseNEOs(page = 0, size = 20) {
    const pageNum = Math.max(0, parseInt(page, 10));
    const data = await this.getOrFetch('/neo/browse', { page: pageNum, size });
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response from NASA API');
    }
    const raw = data.near_earth_objects;
    const near_earth_objects = Array.isArray(raw) ? raw : (raw && typeof raw === 'object' ? Object.values(raw).flat().filter(Boolean) : []);
    const nasaPage = data.page || {};
    const total_elements = nasaPage.total_elements != null ? nasaPage.total_elements : near_earth_objects.length;
    const total_pages = nasaPage.total_pages != null ? nasaPage.total_pages : 1;
    return {
      near_earth_objects,
      page: { number: pageNum, total_pages: Math.max(1, total_pages), total_elements },
      links: data.links || {},
    };
  }

  calculateRiskScore(asteroid) {
    let score = 0;
    const diameter = asteroid.estimated_diameter?.kilometers
      ? (asteroid.estimated_diameter.kilometers.estimated_diameter_min + asteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2
      : 0;
    const approaches = asteroid.close_approach_data || [];
    const earthApproach = approaches.find((a) => (a.orbiting_body || '').toLowerCase() === 'earth');
    const closeApproach = earthApproach || approaches[0];
    const velocity = parseFloat(closeApproach?.relative_velocity?.kilometers_per_hour) || 0;
    const missDistance = parseFloat(closeApproach?.miss_distance?.kilometers) || Infinity;
    if (asteroid.is_potentially_hazardous_asteroid) score += 30;
    if (diameter > 1) score += 30;
    else if (diameter > 0.5) score += 20;
    else if (diameter > 0.2) score += 10;
    else score += 5;
    if (velocity > 100000) score += 25;
    else if (velocity > 50000) score += 15;
    else if (velocity > 25000) score += 8;
    else score += 3;
    const lunarDistance = 384400;
    if (missDistance < lunarDistance) score += 15;
    else if (missDistance < lunarDistance * 5) score += 10;
    else if (missDistance < lunarDistance * 20) score += 5;
    else score += 2;
    return Math.min(100, score);
  }

  getRiskLevel(score) {
    if (score >= 70) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }

  enrichAsteroidData(asteroid) {
    if (!asteroid || typeof asteroid !== 'object') return asteroid;
    try {
      const riskScore = this.calculateRiskScore(asteroid);
      const riskLevel = this.getRiskLevel(riskScore);
      return { ...asteroid, risk_analysis: { score: riskScore, level: riskLevel } };
    } catch (err) {
      return { ...asteroid, risk_analysis: { score: 0, level: 'low' } };
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

module.exports = new NASAService();
