import { Asteroid } from '@/types/asteroid';
import { motion } from 'framer-motion';
import { AlertTriangle, ExternalLink, Target, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AsteroidDetailsPanelProps {
  asteroid: Asteroid | null;
  onViewImpact: () => void;
  onInspect?: () => void;
  isWatched?: boolean;
  onToggleWatch?: () => void;
}

export const AsteroidDetailsPanel = ({ 
  asteroid, 
  onViewImpact, 
  onInspect,
  isWatched = false,
  onToggleWatch,
}: AsteroidDetailsPanelProps) => {
  if (!asteroid) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 font-mono text-sm">
            Select an asteroid from the list to view its detailed properties
          </p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const details = [
    { label: 'Name:', value: asteroid.name, highlight: false },
    { label: 'Hazardous?', value: asteroid.isHazardous ? 'true' : 'false', highlight: true, isWarning: asteroid.isHazardous },
    { label: 'Diameter (Meters):', value: formatNumber((asteroid.diameterMin + asteroid.diameterMax) / 2), highlight: false },
    { label: 'Orbiting body:', value: asteroid.orbitingBody, highlight: false },
    { label: 'Miss-distance (Mi):', value: formatNumber(asteroid.missDistance), highlight: false },
    { label: 'Speed (MPH):', value: formatNumber(asteroid.velocity), highlight: false },
    { label: 'Speed (KMPS):', value: formatNumber(asteroid.velocityKmps), highlight: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      {/* Watchlist Toggle */}
      {onToggleWatch && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Button
            variant="outline"
            onClick={onToggleWatch}
            className={`w-full font-mono text-xs uppercase tracking-wider transition-all border ${
              isWatched
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30'
                : 'border-white/20 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400'
            }`}
          >
            <Star className={`w-4 h-4 mr-2 ${isWatched ? 'fill-cyan-400' : ''}`} />
            {isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </Button>
        </motion.div>
      )}

      <div className="space-y-3 flex-1">
        {details.map((detail) => (
          <div key={detail.label} className="flex justify-between items-center py-1 border-b border-white/10">
            <span className={`font-mono text-xs ${detail.highlight ? 'text-cyan-400' : 'text-gray-400'}`}>
              {detail.label}
              {detail.isWarning && <AlertTriangle className="inline w-4 h-4 ml-1 text-amber-400" />}
            </span>
            <span className={`font-sans text-right text-sm ${detail.isWarning ? 'text-red-400' : 'text-white'}`}>
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {/* Inspect Button */}
      {onInspect && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onInspect}
          className="mt-4 w-full py-3 px-4 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-orbitron text-sm tracking-wider rounded-sm transition-colors hover:bg-cyan-500/30 flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Full Inspection Report
        </motion.button>
      )}

      {/* Hypothetical Hit Section */}
      <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-sm">
        <p className="text-sm text-white font-mono mb-4 text-center">
          Simulate what would happen if this asteroid impacted Earth
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewImpact}
          className="w-full py-3 px-4 bg-black/40 border border-white/10 hover:border-red-500/50 text-white font-orbitron text-sm tracking-wider rounded-sm transition-colors"
        >
          Hypothetical Impact
        </motion.button>
      </div>

      {/* NASA Link */}
      <div className="mt-4 text-center">
        <a
          href={`https://ssd.jpl.nasa.gov/sbdb.cgi?sstr=${asteroid.nasaId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-cyan-400 hover:underline font-mono"
        >
          View on NASA JPL Database →
        </a>
      </div>
    </motion.div>
  );
};
