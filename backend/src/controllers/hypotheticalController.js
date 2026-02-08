const OpenAI = require('openai');

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * POST /api/hypothetical-hit
 * Body: { name, diameterKm, velocityKmh, missDistanceKm, riskScore, isHazardous }
 * Returns AI-generated hypothetical Earth impact scenario.
 */
exports.hypotheticalHit = async (req, res, next) => {
  try {
    if (!openai) {
      return res.status(503).json({
        success: false,
        message: 'OpenAI API is not configured. Add OPENAI_API_KEY to your .env file.',
      });
    }
    const { name, diameterKm, velocityKmh, missDistanceKm, riskScore, isHazardous } = req.body;
    const diamKm = typeof diameterKm === 'number' ? diameterKm : 0;
    const diameterM = diamKm * 1000;
    const prompt = `You are an expert planetary scientist. Given an asteroid with these characteristics:
- Name: ${name || 'Unknown'}
- Diameter: ${diamKm > 0 ? diamKm.toFixed(2) : '?'} km (${diameterM > 0 ? diameterM.toFixed(0) : '?'} meters)
- Velocity: ${velocityKmh != null ? velocityKmh.toLocaleString() : '?'} km/h
- Miss distance: ${missDistanceKm != null ? (missDistanceKm / 1e6).toFixed(2) : '?'} million km (if it were to hit)
- Risk level: ${riskScore || 'unknown'}
- Potentially hazardous: ${isHazardous ? 'Yes' : 'No'}

Write a concise, scientifically-informed paragraph (3-5 sentences) describing what would happen if this asteroid actually hit Earth. Consider: impact energy, crater size, blast radius, regional vs global effects, tsunamis if ocean impact, climate effects. Be realistic but engaging. Use plain language.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });
    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      return res.status(500).json({ success: false, message: 'No response from AI' });
    }
    return res.status(200).json({ success: true, scenario: text });
  } catch (error) {
    const msg = error?.message || 'Failed to generate hypothetical impact scenario';
    const status = error?.status === 401 ? 401 : error?.status === 429 ? 429 : 500;
    return res.status(status).json({ success: false, message: msg });
  }
};
