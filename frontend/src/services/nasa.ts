import { Asteroid } from "@/types/asteroid";

const NASA_API_KEY = 'u6aosSwzhfX2jYjx8uHwl35hOYEgwUZFC99L2PSw';
const BASE_URL = 'https://api.nasa.gov/neo/rest/v1/neo';

export interface OrbitalData {
  orbit_id: string;
  orbit_determination_date: string;
  first_observation_date: string;
  last_observation_date: string;
  data_arc_in_days: number;
  observations_used: number;
  orbit_uncertainty: string;
  minimum_orbit_intersection: string; // AU
  jupiter_tisserand_invariant: string;
  epoch_osculation: string;
  eccentricity: string;
  semi_major_axis: string; // AU
  inclination: string; // deg
  ascending_node_longitude: string; // deg
  orbital_period: string;
  perihelion_distance: string; // AU
  perihelion_argument: string; // deg
  aphelion_distance: string;
  perihelion_time: string;
  mean_anomaly: string; // deg
  mean_motion: string; // deg/day
  equinox: string; // "J2000"
}

export interface NasaNeo {
  id: string;
  neo_reference_id: string;
  name: string;
  name_limited: string;
  designation: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: {
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }[];
  orbital_data: OrbitalData;
  is_sentry_object: boolean;
}

interface BrowseResponse {
  links: {
    next: string;
    prev: string;
    self: string;
  };
  page: {
    size: number;
    total_elements: number;
    total_pages: number;
    number: number;
  };
  near_earth_objects: NasaNeo[];
}

export const fetchBrowseNeos = async (): Promise<NasaNeo[]> => {
  try {
    const response = await fetch(`${BASE_URL}/browse?api_key=${NASA_API_KEY}`);
    if (!response.ok) {
        throw new Error(`NASA API Error: ${response.statusText}`);
    }
    const data: BrowseResponse = await response.json();
    return data.near_earth_objects;
  } catch (error) {
    console.error("Failed to fetch NEOs:", error);
    return [];
  }
};

// Helper: Convert NASA NEO to our app's Asteroid type (if needed for compatibility)
export const mapNasaNeoToAsteroid = (neo: NasaNeo): Asteroid => {
  const diameterMin = neo.estimated_diameter.meters.estimated_diameter_min;
  const diameterMax = neo.estimated_diameter.meters.estimated_diameter_max;
  const approach = neo.close_approach_data[0]; // Most recent or upcoming
  
  // Clean name
  const name = neo.name.replace('(', '').replace(')', '');

  return {
    id: neo.id,
    name: name,
    code: neo.name_limited,
    type: neo.is_potentially_hazardous_asteroid ? 'PHA' : 'NEO',
    orbitClass: 'Apollo', // Simplified, derived from orbital_data usually
    riskScore: neo.is_potentially_hazardous_asteroid ? 'high' : 'low', // Simplified
    closeApproachDate: approach ? approach.close_approach_date : 'Unknown',
    missDistanceKm: approach ? parseFloat(approach.miss_distance.kilometers) : 0,
    velocityKmH: approach ? parseFloat(approach.relative_velocity.kilometers_per_hour) : 0,
    diameterMin: diameterMin,
    diameterMax: diameterMax,
    isHazardous: neo.is_potentially_hazardous_asteroid,
  };
};
