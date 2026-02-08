import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, Maximize2, Minimize2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getSocket } from '@/services/socket';

const CHAT_USERNAME_KEY = 'stellar_chat_username';
const USER_NAME_KEY = 'userName';
const USER_AVATAR_KEY = 'userAvatar';

function getUsername(): string {
  try {
    const userName = localStorage.getItem(USER_NAME_KEY);
    if (userName && userName.trim()) return userName.trim();
    const chatName = localStorage.getItem(CHAT_USERNAME_KEY);
    if (chatName && chatName.trim()) return chatName.trim();
  } catch (_) {}
  return 'Guest';
}

function getAvatarForMessage(msg: { user: string; avatar?: string | null }, isCurrentUser: boolean): string | null {
  if (msg.avatar) return msg.avatar;
  if (isCurrentUser) {
    try {
      return localStorage.getItem(USER_AVATAR_KEY);
    } catch (_) {}
  }
  return null;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || name[0]?.toUpperCase() || '?';
}

interface ChatMessage {
  id: string;
  user: string;
  avatar?: string | null;
  message: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

import { Asteroid } from '@/types/asteroid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CommunityChatProps {
  asteroids: Asteroid[];
  selectedAsteroidId: string | null;
  onSelectAsteroid: (asteroid: Asteroid | null) => void;
  onFollowRoom?: (asteroidId: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const CommunityChat = ({
  asteroids,
  selectedAsteroidId,
  onSelectAsteroid,
  onFollowRoom,
  isFullscreen = false,
  onToggleFullscreen,
}: CommunityChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const username = getUsername();
  const asteroidId = selectedAsteroidId;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (asteroidId == null || asteroidId === '') {
      setMessages([]);
      setConnected(false);
      return;
    }

    const roomId = String(asteroidId);
    const socket = getSocket();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onRoomMessages = (roomMessages: Array<{ id: string; username: string; avatar?: string | null; message: string; timestamp: string }>) => {
      const list: ChatMessage[] = (roomMessages || []).map((m) => ({
        id: m.id,
        user: m.username,
        avatar: m.avatar ?? null,
        message: m.message,
        timestamp: typeof m.timestamp === 'string' ? new Date(m.timestamp) : new Date(),
        isCurrentUser: m.username === username,
      }));
      setMessages(list);
    };

    const onNewMessage = (payload: { id: string; username: string; avatar?: string | null; message: string; timestamp: string | Date }) => {
      const ts = typeof payload.timestamp === 'string' ? new Date(payload.timestamp) : payload.timestamp;
      setMessages((prev) => [
        ...prev,
        {
          id: payload.id,
          user: payload.username,
          avatar: payload.avatar ?? null,
          message: payload.message,
          timestamp: ts,
          isCurrentUser: payload.username === username,
        },
      ]);
    };

    setConnected(socket.connected);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room-messages', onRoomMessages);
    socket.on('new-message', onNewMessage);

    socket.emit('join-room', roomId);
    onFollowRoom?.(roomId);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room-messages', onRoomMessages);
      socket.off('new-message', onNewMessage);
    };
  }, [asteroidId, username, onFollowRoom]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || asteroidId == null || asteroidId === '') return;

    const socket = getSocket();
    const avatar = typeof window !== 'undefined' ? localStorage.getItem(USER_AVATAR_KEY) : null;
    socket.emit('send-message', {
      asteroidId: String(asteroidId),
      message: newMessage.trim(),
      username,
      avatar: avatar || undefined,
    });

    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="panel-glass rounded-xl overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-white/10 bg-black/25">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <span className="font-orbitron text-sm font-bold tracking-widest text-white">COMMUNITY CHAT</span>
          <span className="ml-auto flex items-center gap-2">
            {onToggleFullscreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
                className="h-7 w-7 p-0 text-gray-400 hover:text-cyan-400"
                title={isFullscreen ? 'Exit full screen' : 'Full screen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            )}
            <span className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
            {connected ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-gray-500 rounded-full" />
                Offline
              </>
            )}
            </span>
          </span>
        </div>
        <div className="mt-2">
          <Select
            value={selectedAsteroidId ?? ''}
            onValueChange={(v) => {
              const a = asteroids.find((x) => x.id === v);
              onSelectAsteroid(a ?? null);
            }}
          >
            <SelectTrigger className="h-8 bg-black/40 border-white/10 text-white font-mono text-xs">
              <SelectValue placeholder="Select asteroid to chat..." />
            </SelectTrigger>
            <SelectContent>
              {asteroids.map((a) => (
                <SelectItem key={a.id} value={a.id} className="font-mono">
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.length === 0 && (
            <p className="text-xs text-gray-500 font-mono text-center py-4">
              {asteroidId != null ? 'No messages yet. Start the conversation.' : 'Select an asteroid to open its chat.'}
            </p>
          )}
          {messages.map((msg) => {
            const avatarUrl = getAvatarForMessage(msg, msg.isCurrentUser);
            return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.isCurrentUser ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={avatarUrl || undefined} alt={msg.user} />
                <AvatarFallback
                  className={`w-8 h-8 text-xs font-medium ${
                    msg.isCurrentUser ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {getInitials(msg.user)}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[75%] ${msg.isCurrentUser ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-mono ${msg.isCurrentUser ? 'text-cyan-400' : 'text-gray-400'}`}>
                    {msg.user}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div className={`px-3 py-2 rounded-sm text-sm font-sans ${
                  msg.isCurrentUser
                    ? 'bg-cyan-500/20 text-white'
                    : 'bg-black/25 text-white border border-white/10'
                }`}>
                  {msg.message}
                </div>
              </div>
            </motion.div>
          );
          })}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-black/25">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={asteroidId != null ? 'Type a message...' : 'Select an asteroid to chat'}
            disabled={asteroidId == null}
            className="flex-1 bg-black/40 border-white/10 text-white font-mono text-sm placeholder:text-gray-500"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newMessage.trim() || asteroidId == null}
            className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
