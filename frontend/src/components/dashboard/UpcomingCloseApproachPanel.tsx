import { useMemo } from 'react';
import { Asteroid } from '@/types/asteroid';
import { Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const DAYS_AHEAD = 30;

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

interface UpcomingCloseApproachPanelProps {
  asteroids: Asteroid[];
  onSelectAsteroid?: (a: Asteroid) => void;
}

export function UpcomingCloseApproachPanel({ asteroids, onSelectAsteroid }: UpcomingCloseApproachPanelProps) {
  const upcoming = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() + DAYS_AHEAD);
    return asteroids
      .filter((a) => {
        const d = new Date(a.closeApproachDate);
        return !isNaN(d.getTime()) && d >= now && d <= cutoff;
      })
      .sort((a, b) => new Date(a.closeApproachDate).getTime() - new Date(b.closeApproachDate).getTime())
      .slice(0, 20);
  }, [asteroids]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative h-9 px-3 border-white/20 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400 font-mono text-xs uppercase tracking-wider"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Notifications
          {upcoming.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-black">
              {upcoming.length > 10 ? '10+' : upcoming.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[320px] bg-card border-border p-0"
      >
        <div className="p-3 border-b border-border">
          <h3 className="font-orbitron text-sm font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Upcoming close approaches
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Next {DAYS_AHEAD} days
          </p>
        </div>
        <ScrollArea className="h-[280px]">
          {upcoming.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm font-mono">
              No close approaches in the next {DAYS_AHEAD} days.
            </div>
          ) : (
            <ul className="p-2 space-y-1">
              {upcoming.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onSelectAsteroid?.(a)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors border border-transparent hover:border-cyan-500/30"
                  >
                    <p className="font-sans text-sm font-medium text-foreground truncate">{a.name}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {formatDate(a.closeApproachDate)} · {a.riskScore}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
