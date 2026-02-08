import { Asteroid } from '@/types/asteroid';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, Shield, Star } from 'lucide-react';

interface AsteroidListItemProps {
  asteroid: Asteroid;
  isSelected: boolean;
  onClick: () => void;
  /** When provided, shows a Watch star that toggles saved state. */
  isWatched?: boolean;
  onToggleWatch?: (e: React.MouseEvent) => void;
}

export const AsteroidListItem = ({
  asteroid,
  isSelected,
  onClick,
  isWatched = false,
  onToggleWatch,
}: AsteroidListItemProps) => {
  const getRiskIcon = () => {
    switch (asteroid.riskScore) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'medium':
        return <Info className="w-4 h-4 text-amber-400" />;
      default:
        return <Shield className="w-4 h-4 text-green-400" />;
    }
  };

  return (
    <motion.button
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left p-4 border transition-all duration-200 rounded-sm font-sans ${
        isSelected
          ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)]'
          : 'border-white/10 hover:border-cyan-500/50 bg-black/40'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm md:text-base text-white truncate font-medium flex-1 min-w-0">
          {asteroid.name}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onToggleWatch && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatch(e);
              }}
              className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-colors"
              aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <Star
                className="w-4 h-4"
                fill={isWatched ? 'currentColor' : 'none'}
                stroke="currentColor"
              />
            </button>
          )}
          {getRiskIcon()}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-1">
        {asteroid.isHazardous && (
          <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded font-mono uppercase">
            HAZARDOUS
          </span>
        )}
        <span className="text-xs text-gray-400 font-mono">
          {new Date(asteroid.closeApproachDate).toLocaleDateString()}
        </span>
      </div>
    </motion.button>
  );
};
