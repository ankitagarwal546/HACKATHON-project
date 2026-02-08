import { useRef } from 'react';
import { Camera, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/services/auth';
import { useNavigate } from 'react-router-dom';

const USER_AVATAR_KEY = 'userAvatar';
const USER_NAME_KEY = 'userName';
const USER_EMAIL_KEY = 'userEmail';

export function ProfileDropdown() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarUrl = typeof window !== 'undefined' ? localStorage.getItem(USER_AVATAR_KEY) : null;
  const userName = typeof window !== 'undefined' ? localStorage.getItem(USER_NAME_KEY) : null;
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem(USER_EMAIL_KEY) : null;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      localStorage.setItem(USER_AVATAR_KEY, dataUrl);
      window.dispatchEvent(new Event('storage'));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const initials = userName
    ? userName
        .split(/\s+/)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : userEmail?.[0]?.toUpperCase() ?? 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 border border-white/20 hover:border-cyan-500/50 overflow-hidden"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl || undefined} alt={userName || 'Profile'} />
            <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-card border-border p-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl || undefined} alt={userName || 'Profile'} />
              <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{userName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail || ''}</p>
            </div>
          </div>
        </div>
        <div className="p-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-4 h-4" />
            Change photo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
