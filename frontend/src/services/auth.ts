/**
 * Auth Service – wired to Hackathon-COSMIC-WATCH backend.
 * Login and signup use real API only; no mock fallback.
 */

import { apiRequest } from '@/lib/apiClient';

const TOKEN_KEY = 'token';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface RegisterResponse {
  user: AuthUser;
  token: string;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  if (!email?.trim()) throw new Error('Email is required');
  if (!password) throw new Error('Password is required');
  // Empty base = same origin; Vite proxy in dev forwards /api to backend (see vite.config.ts)
  const data = await apiRequest<{ success: boolean; token: string; user: { id: string; name?: string; email: string } }>(
    '/api/user/login',
    {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
      skipAuth: true,
    }
  );
  if (!data?.token || !data?.user) throw new Error('Invalid response from server');
  localStorage.setItem(TOKEN_KEY, data.token);
  return {
    user: { id: String(data.user.id), email: data.user.email, name: data.user.name },
    token: data.token,
  };
}

export async function registerUser(email: string, password: string, name?: string): Promise<RegisterResponse> {
  if (!email?.trim()) throw new Error('Email is required');
  if (!password) throw new Error('Password is required');
  const displayName = name?.trim() || email.trim().split('@')[0] || 'User';
  // Empty base = same origin; Vite proxy in dev forwards /api to backend
  const data = await apiRequest<{ success: boolean; token: string; user: { id: string; name?: string; email: string } }>(
    '/api/user/signup',
    {
      method: 'POST',
      body: JSON.stringify({ name: displayName, email: email.trim(), password }),
      skipAuth: true,
    }
  );
  if (!data?.token || !data?.user) throw new Error('Invalid response from server');
  localStorage.setItem(TOKEN_KEY, data.token);
  return {
    user: { id: String(data.user.id), email: data.user.email, name: data.user.name },
    token: data.token,
  };
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('isAuthenticated');
}
