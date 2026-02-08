import type { Asteroid } from '@/types/asteroid';
import type { ImpactScenario } from '@/types/asteroid';

/**
 * Compute impact scenario from real asteroid data (diameter, velocity).
 */
export function calculateImpactScenario(asteroid: Asteroid): ImpactScenario {
  const avgDiameter = (asteroid.diameterMin + asteroid.diameterMax) / 2;
  const velocityMs = asteroid.velocityKmps * 1000;

  const mass = (4 / 3) * Math.PI * Math.pow(avgDiameter / 2, 3) * 3000;
  const impactEnergy = (0.5 * mass * Math.pow(velocityMs, 2)) / 4.184e15;

  const craterDiameter = Math.pow(impactEnergy, 0.3) * 1.5;
  const affectedRadius = Math.pow(impactEnergy, 0.4) * 10;

  let threatLevel: ImpactScenario['threatLevel'];
  let description: string;
  let survivalChance: string;

  if (avgDiameter < 100) {
    threatLevel = 'local';
    description =
      'Would likely explode in the atmosphere, causing localized damage similar to the Chelyabinsk event.';
    survivalChance = 'High if not near ground zero';
  } else if (avgDiameter < 500) {
    threatLevel = 'regional';
    description = 'Would cause significant regional destruction with a large crater and widespread fires.';
    survivalChance = 'Questionable near impact zone';
  } else if (avgDiameter < 1000) {
    threatLevel = 'global';
    description =
      'Would trigger global climate effects, tsunamis if ocean impact, and widespread devastation.';
    survivalChance = 'Would affect global climate and food production';
  } else {
    threatLevel = 'extinction';
    description =
      'If you were anywhere close to the impact area, survival would be questionable, because this type of Asteroid is an extinction-level Asteroid.';
    survivalChance = 'Mass extinction event likely';
  }

  return {
    asteroid,
    impactEnergy: Math.round(impactEnergy * 100) / 100,
    craterDiameter: Math.round(craterDiameter * 10) / 10,
    affectedRadius: Math.round(affectedRadius),
    description,
    survivalChance,
    threatLevel,
  };
}
