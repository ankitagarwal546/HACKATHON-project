import { motion } from 'framer-motion';
import { Eye, EyeOff, Star, Trash2 } from 'lucide-react';
import { Asteroid } from '@/types/asteroid';
import { WatchlistItem } from '@/hooks/useWatchlist';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface WatchlistPanelProps {
  watchlist: WatchlistItem[];
  asteroids: Asteroid[];
  asteroidCache?: Record<string, Asteroid>;
  onSelectAsteroid: (asteroid: Asteroid) => void;
  onRemoveFromWatchlist: (asteroidId: string) => void;
  selectedAsteroidId?: string;
}

export const WatchlistPanel = ({
  watchlist,
  asteroids,
  asteroidCache = {},
  onSelectAsteroid,
  onRemoveFromWatchlist,
  selectedAsteroidId,
}: WatchlistPanelProps) => {
  const watchedAsteroids = watchlist
    .map(item => ({
      ...item,
      asteroid: asteroids.find(a => a.id === item.asteroidId) ?? asteroidCache[item.asteroidId],
    }))
    .filter((item): item is { asteroid: Asteroid } & typeof item => Boolean(item.asteroid));

  if (watchlist.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-8 min-h-0">
        <Eye className="w-12 h-12 text-gray-500/50 mx-auto mb-3" />
        <p className="text-sm text-gray-400 font-mono">
          No asteroids in your watchlist
        </p>
        <p className="text-xs text-gray-500 font-mono mt-1">
          Click the star icon on any asteroid to add it
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="space-y-2 pr-4">
        {watchedAsteroids.map(({ asteroid, addedAt }) => {
          if (!asteroid) return null;
          
          return (
            <motion.div
              key={asteroid.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between p-3 rounded-sm border transition-all cursor-pointer ${
                selectedAsteroidId === asteroid.id
                  ? 'border-cyan-500/50 bg-cyan-500/10'
                  : 'border-white/10 bg-black/40 hover:border-cyan-500/50'
              }`}
              onClick={() => onSelectAsteroid(asteroid)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Star className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="currentColor" />
                <div className="min-w-0">
                  <p className="font-sans text-sm text-white truncate">
                    {asteroid.name}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">
                    Added {new Date(addedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded font-mono uppercase ${
                  asteroid.riskScore === 'high' ? 'bg-red-500/20 text-red-400' :
                  asteroid.riskScore === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {asteroid.riskScore}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromWatchlist(asteroid.id);
                  }}
                  className="h-7 w-7 p-0 text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
