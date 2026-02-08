import { useState, useEffect, useCallback } from 'react';
import { getSocket } from '@/services/socket';

const USER_NAME_KEY = 'userName';
const CHAT_FOLLOWED_KEY = 'stellar_chat_followed';

function getUsername(): string {
  try {
    return localStorage.getItem(USER_NAME_KEY)?.trim() || '';
  } catch (_) {}
  return '';
}

function getFollowedRooms(): string[] {
  try {
    const s = localStorage.getItem(CHAT_FOLLOWED_KEY);
    if (s) {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.slice(0, 20);
    }
  } catch (_) {}
  return [];
}

function addFollowedRoom(asteroidId: string) {
  const current = getFollowedRooms();
  if (current.includes(asteroidId)) return;
  const next = [asteroidId, ...current.filter((id) => id !== asteroidId)].slice(0, 20);
  try {
    localStorage.setItem(CHAT_FOLLOWED_KEY, JSON.stringify(next));
  } catch (_) {}
}

interface UseChatUnreadProps {
  isChatOpen: boolean;
  currentAsteroidId: string | null;
  onFollowRoom?: (asteroidId: string) => void;
}

export function useChatUnread({ isChatOpen, currentAsteroidId, onFollowRoom }: UseChatUnreadProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const username = getUsername();

  const clearUnread = useCallback(() => setUnreadCount(0), []);
  const followRoom = useCallback((asteroidId: string) => {
    addFollowedRoom(asteroidId);
    getSocket().emit('join-room', asteroidId);
    onFollowRoom?.(asteroidId);
  }, [onFollowRoom]);

  useEffect(() => {
    const socket = getSocket();
    const followed = getFollowedRooms();
    followed.forEach((roomId) => socket.emit('join-room', roomId));
  }, []);

  useEffect(() => {
    const socket = getSocket();
    const followed = getFollowedRooms();

    const onNewMessage = (payload: {
      id: string;
      username?: string;
      message: string;
      timestamp: Date | string;
      asteroidId?: string;
    }) => {
      const fromOther = payload.username && payload.username !== username;
      if (!fromOther) return;
      const roomId = payload.asteroidId ?? null;
      const currentFollowed = getFollowedRooms();
      if (!roomId || !currentFollowed.includes(roomId)) return;
      const shouldIncrement = !isChatOpen || currentAsteroidId !== roomId;
      if (shouldIncrement) setUnreadCount((c) => c + 1);
    };

    socket.on('new-message', onNewMessage);
    return () => socket.off('new-message', onNewMessage);
  }, [username, isChatOpen, currentAsteroidId]);

  useEffect(() => {
    if (isChatOpen) setUnreadCount(0);
  }, [isChatOpen]);

  return { unreadCount, clearUnread, followRoom };
}
