
// Astronomical constants
const J2000_DATE = new Date('2000-01-01T12:00:00Z');
const AU_TO_KM = 149597870.7;

// Convert degrees to radians
const degToRad = (deg: number) => (deg * Math.PI) / 180;
const radToDeg = (rad: number) => (rad * 180) / Math.PI;

interface OrbitalElements {
  semi_major_axis: number; // a (AU)
  eccentricity: number; // e
  inclination: number; // i (deg)
  ascending_node_longitude: number; // om (deg) - Omega
  perihelion_argument: number; // w (deg) - omega
  mean_anomaly: number; // M (deg)
  epoch_osculation?: number; // Julian Date approx or ms of epoch
  mean_motion?: number; // n (deg/day)
}

// Earth's simplified orbital elements (J2000)
const EARTH_ELEMENTS: OrbitalElements = {
  semi_major_axis: 1.00000261,
  eccentricity: 0.01671123,
  inclination: -0.00001531,
  ascending_node_longitude: 0.0, // simplified reference plane
  perihelion_argument: 102.93768193,
  mean_anomaly: 357.51716, // at J2000
  mean_motion: 0.98560028 // deg/day
};

/**
 * Solves Kepler's Equation M = E - e*sin(E) for E (Eccentric Anomaly)
 */
function solveKepler(M: number, e: number): number {
  let E = M;
  const tolerance = 1e-6;
  const maxIter = 30;

  for (let i = 0; i < maxIter; i++) {
    const delta = E - e * Math.sin(E) - M;
    if (Math.abs(delta) < tolerance) break;
    E -= delta / (1 - e * Math.cos(E));
  }
  return E;
}

/**
 * Calculates Heliocentric Cartesian Coordinates (x, y, z) in AU
 */
export function getHeliocentricPosition(elements: OrbitalElements, date: Date = new Date()): { x: number; y: number; z: number } {
  const {
      semi_major_axis: a,
      eccentricity: e,
      inclination: iDeg,
      ascending_node_longitude: omDeg,
      perihelion_argument: wDeg,
      mean_anomaly: M0Deg,
      mean_motion: nDaily
  } = elements;

  const i = degToRad(iDeg);
  const om = degToRad(omDeg);
  const w = degToRad(wDeg);
  const M0 = degToRad(M0Deg);

  // Time difference in days since J2000 (or epoch if provided, but assuming J2000 for simplicity of Earth, 
  // and specific Epoch for NEOs if we want to be precise, but usually we just propagate from J2000 or the epoch)
  
  // NOTE: NASA Data gives Mean Anomaly AT epoch_osculation.
  // We need n (mean motion) to propagate to today.
  // If n is missing, calculate from a: n = 0.9856076686 / a^1.5 (deg/day)
  
  let n = nDaily ? degToRad(nDaily) : degToRad(0.9856076686 / Math.pow(a, 1.5));
  
  // Calculate delta time (days)
  // Check if we have an epoch, otherwise assume elements are fresh or J2000 (usually NASA browse is mixed)
  // For this visualization, we will assume elements mean anomaly is relatively recent or we propagate from J2000 for Earth.
  // For NEOs, we should use their epoch. 
  
  // Simplified: If "epoch_osculation" isn't passed as a Date number, we treat M0 as M_current (static) 
  // OR we propagate if we want movement.
  // For "Revolving", we need movement over time.
  // Let's propagate from J2000 for Earth.
  
  const daysSinceJ2000 = (date.getTime() - J2000_DATE.getTime()) / (1000 * 60 * 60 * 24);
  
  // If specific epoch for asteroid is provided in Julian Date converted to logic, use it.
  // Else, simplistic propagation for visualization:
  // M = M0 + n * dt
  
  const M = M0 + n * daysSinceJ2000;

  // 1. Solve Kepler
  const E = solveKepler(M, e);

  // 2. True Anomaly
  const v = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
  
  // 3. Radius
  const r = a * (1 - e * Math.cos(E));

  // 4. Position in orbital plane
  const x_orb = r * Math.cos(v);
  const y_orb = r * Math.sin(v);
  
  // 5. Rotate to Heliocentric Ecliptic
  // x = x'(cos w cos om - sin w sin om cos i) - y'(sin w cos om + cos w sin om cos i)
  // y = x'(cos w sin om + sin w cos om cos i) - y'(sin w sin om - cos w cos om cos i)
  // z = x'(sin w sin i) + y'(cos w sin i)
  
  const cos_om = Math.cos(om);
  const sin_om = Math.sin(om);
  const cos_w = Math.cos(w);
  const sin_w = Math.sin(w);
  const cos_i = Math.cos(i);
  const sin_i = Math.sin(i);

  const x = x_orb * (cos_w * cos_om - sin_w * sin_om * cos_i) - y_orb * (sin_w * cos_om + cos_w * sin_om * cos_i);
  const y = x_orb * (cos_w * sin_om + sin_w * cos_om * cos_i) - y_orb * (sin_w * sin_om - cos_w * cos_om * cos_i);
  const z = x_orb * (sin_w * sin_i) + y_orb * (cos_w * sin_i);

  return { x, y, z }; // Units: AU
}

export function getEarthPosition(date: Date = new Date()) {
    return getHeliocentricPosition(EARTH_ELEMENTS, date);
}

// Convert AU to 3D Scene Units (e.g., 1 AU = 100 units)
export const AU_SCALE = 100;
export const posToVector3 = (pos: { x: number; y: number; z: number }) => {
    return [pos.x * AU_SCALE, pos.z * AU_SCALE, -pos.y * AU_SCALE] as [number, number, number]; // Y-up in Threejs, Z is depth. Astro Z is "Up" usually. Map Astro Z -> Three Y. Astro Y -> Three -Z?
    // Standard Math:
    // X axis: Vernal Equinox
    // Z axis: North Ecliptic Pole
    // Y axis: 90 deg East
    
    // ThreeJS:
    // Y is Up.
    // So Astro Z -> Three Y.
    // Astro X -> Three X.
    // Astro Y -> Three -Z (Right Hand Rule).
    
    return [pos.x * AU_SCALE, pos.z * AU_SCALE, -pos.y * AU_SCALE] as [number, number, number];
};
