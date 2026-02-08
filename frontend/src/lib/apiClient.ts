/**
 * API client for Cosmic Watch backend (Hackathon-COSMIC-WATCH).
 * Base URL: VITE_API_BASE_URL or same origin when proxied.
 */

const getApiBase = (): string => {
  const env = import.meta.env.VITE_API_BASE_URL;
  if (env) return env.replace(/\/$/, '');
  return '';
};

const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export type BackendAsteroid = {
  id?: string;
  neo_reference_id?: string;
  name: string;
  is_potentially_hazardous_asteroid?: boolean;
  estimated_diameter?: { kilometers?: { estimated_diameter_min: number; estimated_diameter_max: number } };
  close_approach_data?: Array<{
    close_approach_date?: string;
    relative_velocity?: { kilometers_per_hour?: string };
    miss_distance?: { kilometers?: string };
    orbiting_body?: string;
  }>;
  absolute_magnitude_h?: number;
  risk_analysis?: { score: number; level: string };
};

export type ApiRequestOptions = RequestInit & { skipAuth?: boolean };

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;
  const base = getApiBase();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };
  const token = getToken();
  if (!skipAuth && token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });
  const text = await res.text();
  let data: T;
  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new Error(res.ok ? text : `Request failed: ${res.status} ${text}`);
  }
  if (!res.ok) {
    const err = data as { message?: string; errors?: unknown };
    throw new Error(err?.message || `Request failed: ${res.status}`);
  }
  return data;
}

export { getApiBase, getToken };
