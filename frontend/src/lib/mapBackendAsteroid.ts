import type { Asteroid } from '@/types/asteroid';
import type { BackendAsteroid } from '@/lib/apiClient';

/**
 * Map backend/NASA asteroid shape to frontend Asteroid type.
 * Keeps dashboard date bar + cards structure unchanged.
 */
export function mapBackendAsteroidToFrontend(b: BackendAsteroid): Asteroid {
  const id = b.id || b.neo_reference_id || b.name?.replace(/\s/g, '') || 'unknown';
  const closeApproach = b.close_approach_data?.[0];
  const velKmh = closeApproach?.relative_velocity?.kilometers_per_hour;
  const velocityKmh = typeof velKmh === 'string' ? parseFloat(velKmh) || 0 : Number(velKmh) || 0;
  const velocityKmps = velocityKmh / 3600;
  const missKm = closeApproach?.miss_distance?.kilometers;
  const missDistanceKm = typeof missKm === 'string' ? parseFloat(missKm) || 0 : Number(missKm) || 0;
  const diameter = b.estimated_diameter?.kilometers;
  const minD = diameter?.estimated_diameter_min ?? 0;
  const maxD = diameter?.estimated_diameter_max ?? 0;
  const diameterMin = minD * 1000;
  const diameterMax = maxD * 1000;

  const level = (b.risk_analysis?.level ?? 'low') as string;
  const riskScore: 'low' | 'medium' | 'high' =
    level === 'critical' || level === 'high' ? 'high' : level === 'medium' ? 'medium' : 'low';

  return {
    id,
    name: b.name || id,
    nasaId: b.neo_reference_id || id,
    isHazardous: !!b.is_potentially_hazardous_asteroid,
    diameterMin,
    diameterMax,
    velocity: velocityKmh,
    velocityKmps,
    missDistance: missDistanceKm,
    missDistanceKm,
    orbitingBody: closeApproach?.orbiting_body || 'Earth',
    closeApproachDate: closeApproach?.close_approach_date || new Date().toISOString().slice(0, 10),
    absoluteMagnitude: b.absolute_magnitude_h ?? 0,
    riskScore,
  };
}
