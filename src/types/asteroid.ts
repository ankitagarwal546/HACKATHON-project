export interface Asteroid {
  id: string;
  name: string;
  nasaId: string;
  isHazardous: boolean;
  diameterMin: number;
  diameterMax: number;
  velocity: number;
  velocityKmps: number;
  missDistance: number;
  missDistanceKm: number;
  orbitingBody: string;
  closeApproachDate: string;
  absoluteMagnitude: number;
  riskScore: 'low' | 'medium' | 'high';
}

export interface AsteroidGroup {
  month: string;
  year: number;
  asteroids: Asteroid[];
}

export interface ImpactScenario {
  asteroid: Asteroid;
  impactEnergy: number;
  craterDiameter: number;
  affectedRadius: number;
  description: string;
  survivalChance: string;
  threatLevel: 'none' | 'local' | 'regional' | 'global' | 'extinction';
}
