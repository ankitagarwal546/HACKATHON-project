import { Asteroid, AsteroidGroup } from '@/types/asteroid';

// Mock asteroid data simulating NASA NeoWs API response
export const mockAsteroids: Asteroid[] = [
  {
    id: '1',
    name: '265187 (2003 YS117)',
    nasaId: '2265187',
    isHazardous: false,
    diameterMin: 520.5,
    diameterMax: 581.5,
    velocity: 39702.84,
    velocityKmps: 17.75,
    missDistance: 17662823.07,
    missDistanceKm: 28427500,
    orbitingBody: 'Earth',
    closeApproachDate: '2025-07-15',
    absoluteMagnitude: 19.2,
    riskScore: 'low',
  },
  {
    id: '2',
    name: '418416 (2008 LV16)',
    nasaId: '2418416',
    isHazardous: true,
    diameterMin: 340.2,
    diameterMax: 380.8,
    velocity: 52340.12,
    velocityKmps: 23.4,
    missDistance: 4521000.5,
    missDistanceKm: 7275000,
    orbitingBody: 'Earth',
    closeApproachDate: '2025-07-18',
    absoluteMagnitude: 20.1,
    riskScore: 'medium',
  },
  {
    id: '3',
    name: '458723 (2011 KQ12)',
    nasaId: '2458723',
    isHazardous: true,
    diameterMin: 890.3,
    diameterMax: 995.7,
    velocity: 67890.45,
    velocityKmps: 30.35,
    missDistance: 1234567.89,
    missDistanceKm: 1986500,
    orbitingBody: 'Earth',
    closeApproachDate: '2025-07-22',
    absoluteMagnitude: 18.5,
    riskScore: 'high',
  },
  {
    id: '4',
    name: '465098 (2006 UQ217)',
    nasaId: '2465098',
    isHazardous: false,
    diameterMin: 210.5,
    diameterMax: 235.8,
    velocity: 28450.33,
    velocityKmps: 12.72,
    missDistance: 32500000.0,
    missDistanceKm: 52300000,
    orbitingBody: 'Earth',
    closeApproachDate: '2025-07-25',
    absoluteMagnitude: 21.3,
    riskScore: 'low',
  },
  {
    id: '5',
    name: '523847 (2014 FG7)',
    nasaId: '2523847',
    isHazardous: false,
    diameterMin: 145.2,
    diameterMax: 162.5,
    velocity: 31200.78,
    velocityKmps: 13.95,
    missDistance: 28900000.0,
    missDistanceKm: 46510000,
    orbitingBody: 'Earth',
    closeApproachDate: '2025-06-28',
    absoluteMagnitude: 22.0,
    riskScore: 'low',
  },
  {
    id: '6',
    name: '378456 (2007 XN24)',
    nasaId: '2378456',
    isHazardous: true,
    diameterMin: 650.8,
    diameterMax: 728.4,
    velocity: 45678.9,
    velocityKmps: 20.42,
    missDistance: 8750000.0,
    missDistanceKm: 14080000,
    orbitingBody: 'Earth',
    closeApproachDate: '2025-06-15',
    absoluteMagnitude: 18.9,
    riskScore: 'medium',
  },
  {
    id: '7',
    name: '412398 (2009 PQ)',
    nasaId: '2412398',
    isHazardous: false,
    diameterMin: 85.3,
    diameterMax: 95.5,
    velocity: 19850.22,
    velocityKmps: 8.87,
    missDistance: 45200000.0,
    missDistanceKm: 72740000,
    orbitingBody: 'Earth',
    closeApproachDate: '2025-05-10',
    absoluteMagnitude: 23.5,
    riskScore: 'low',
  },
  {
    id: '8',
    name: '527891 (2016 AZ8)',
    nasaId: '2527891',
    isHazardous: true,
    diameterMin: 1250.5,
    diameterMax: 1400.2,
    velocity: 78432.15,
    velocityKmps: 35.07,
    missDistance: 2100000.0,
    missDistanceKm: 3379000,
    orbitingBody: 'Earth',
    closeApproachDate: '2025-05-22',
    absoluteMagnitude: 17.2,
    riskScore: 'high',
  },
  {
    id: '9',
    name: '398745 (2008 CT)',
    nasaId: '2398745',
    isHazardous: false,
    diameterMin: 178.9,
    diameterMax: 200.3,
    velocity: 25340.67,
    velocityKmps: 11.33,
    missDistance: 38900000.0,
    missDistanceKm: 62600000,
    orbitingBody: 'Earth',
    closeApproachDate: '2025-04-18',
    absoluteMagnitude: 21.8,
    riskScore: 'low',
  },
  {
    id: '10',
    name: '485623 (2012 VB38)',
    nasaId: '2485623',
    isHazardous: true,
    diameterMin: 420.5,
    diameterMax: 470.8,
    velocity: 55890.34,
    velocityKmps: 24.99,
    missDistance: 5670000.0,
    missDistanceKm: 9123000,
    orbitingBody: 'Earth',
    closeApproachDate: '2025-04-05',
    absoluteMagnitude: 19.8,
    riskScore: 'medium',
  },
];

// Group asteroids by month
export const getAsteroidsByMonth = (): AsteroidGroup[] => {
  const grouped = mockAsteroids.reduce((acc, asteroid) => {
    const date = new Date(asteroid.closeApproachDate);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const key = `${month} ${year}`;
    
    if (!acc[key]) {
      acc[key] = {
        month,
        year,
        asteroids: [],
      };
    }
    acc[key].asteroids.push(asteroid);
    return acc;
  }, {} as Record<string, AsteroidGroup>);
  
  return Object.values(grouped).sort((a, b) => {
    const dateA = new Date(`${a.month} 1, ${a.year}`);
    const dateB = new Date(`${b.month} 1, ${b.year}`);
    return dateB.getTime() - dateA.getTime();
  });
};

export const calculateImpactScenario = (asteroid: Asteroid) => {
  const avgDiameter = (asteroid.diameterMin + asteroid.diameterMax) / 2;
  const velocityMs = asteroid.velocityKmps * 1000;
  
  // Simplified impact energy calculation (in megatons TNT equivalent)
  const mass = (4/3) * Math.PI * Math.pow(avgDiameter/2, 3) * 3000; // Assuming density of 3000 kg/m³
  const impactEnergy = (0.5 * mass * Math.pow(velocityMs, 2)) / (4.184e15); // Convert to megatons
  
  // Crater diameter estimation (simplified)
  const craterDiameter = Math.pow(impactEnergy, 0.3) * 1.5;
  
  // Affected radius (thermal and shockwave)
  const affectedRadius = Math.pow(impactEnergy, 0.4) * 10;
  
  let threatLevel: 'none' | 'local' | 'regional' | 'global' | 'extinction';
  let description: string;
  let survivalChance: string;
  
  if (avgDiameter < 100) {
    threatLevel = 'local';
    description = 'Would likely explode in the atmosphere, causing localized damage similar to the Chelyabinsk event.';
    survivalChance = 'High if not near ground zero';
  } else if (avgDiameter < 500) {
    threatLevel = 'regional';
    description = 'Would cause significant regional destruction with a large crater and widespread fires.';
    survivalChance = 'Questionable near impact zone';
  } else if (avgDiameter < 1000) {
    threatLevel = 'global';
    description = 'Would trigger global climate effects, tsunamis if ocean impact, and widespread devastation.';
    survivalChance = 'Would affect global climate and food production';
  } else {
    threatLevel = 'extinction';
    description = 'If you were anywhere close to the impact area, survival would be questionable, because this type of Asteroid is an extinction-level Asteroid.';
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
};
