/**
 * Socket.IO client for real-time community chat.
 * Connects to VITE_SOCKET_URL or the same API base (e.g. http://localhost:5001).
 */

import { io, type Socket } from 'socket.io-client';
import { getApiBase } from '@/lib/apiClient';

let socket: Socket | null = null;

function getSocketUrl(): string {
  const env = import.meta.env.VITE_SOCKET_URL;
  if (env) return env.replace(/\/$/, '');
  const base = getApiBase();
  if (base) return base;
  const { hostname, port } = window.location;
  return port ? `${window.location.protocol}//${hostname}:${port}` : window.location.origin;
}

export function getSocket(): Socket {
  if (!socket) {
    const url = getSocketUrl();
    socket = io(url, { path: '/socket.io', withCredentials: true });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
