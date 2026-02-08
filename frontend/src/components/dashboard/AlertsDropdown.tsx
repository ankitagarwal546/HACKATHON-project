import { Bell, AlertTriangle, Settings } from 'lucide-react';
import { Asteroid } from '@/types/asteroid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

interface AlertsDropdownProps {
  alertAsteroids: Asteroid[];
  onSelectAsteroid?: (a: Asteroid) => void;
  onOpenSettings?: () => void;
}

export function AlertsDropdown({ alertAsteroids, onSelectAsteroid, onOpenSettings }: AlertsDropdownProps) {
  const count = alertAsteroids.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative h-9 px-3 border-white/20 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400 font-mono text-xs uppercase tracking-wider"
        >
          <Bell className="w-4 h-4 mr-2" />
          Alerts
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-black">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[320px] bg-card border-border p-0">
        <div className="p-3 border-b border-border">
          <h3 className="font-orbitron text-sm font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            Alert asteroids
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Asteroids matching your alert settings
          </p>
        </div>
        <ScrollArea className="h-[280px]">
          {count === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm font-mono">
              No alert asteroids right now. Adjust your settings for more alerts.
            </div>
          ) : (
            <ul className="p-2 space-y-1">
              {alertAsteroids.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onSelectAsteroid?.(a)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors border border-transparent hover:border-yellow-500/30"
                  >
                    <p className="font-sans text-sm font-medium text-foreground truncate">{a.name}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {formatDate(a.closeApproachDate)} · {a.riskScore} · {(a.missDistanceKm / 1_000_000).toFixed(2)}M km
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
        {onOpenSettings && (
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              onClick={onOpenSettings}
            >
              <Settings className="w-4 h-4" />
              Alert settings
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
