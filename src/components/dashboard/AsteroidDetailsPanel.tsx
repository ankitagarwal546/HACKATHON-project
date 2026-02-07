import { Asteroid } from '@/types/asteroid';
import { motion } from 'framer-motion';
import { AlertTriangle, ExternalLink, Target } from 'lucide-react';

interface AsteroidDetailsPanelProps {
  asteroid: Asteroid | null;
  onViewImpact: () => void;
  onInspect?: () => void;
}

export const AsteroidDetailsPanel = ({ asteroid, onViewImpact, onInspect }: AsteroidDetailsPanelProps) => {
  if (!asteroid) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-rajdhani">
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
      <div className="space-y-3 flex-1">
        {details.map((detail) => (
          <div key={detail.label} className="flex justify-between items-center py-1 border-b border-border/30">
            <span className={`font-rajdhani ${detail.highlight ? 'text-primary' : 'text-muted-foreground'}`}>
              {detail.label}
              {detail.isWarning && <AlertTriangle className="inline w-4 h-4 ml-1 text-warning" />}
            </span>
            <span className={`font-rajdhani text-right ${
              detail.isWarning ? 'text-destructive' : 'text-foreground'
            }`}>
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
          className="mt-4 w-full py-3 px-4 bg-primary/20 border border-primary text-primary font-orbitron text-sm tracking-wider rounded-lg transition-colors hover:bg-primary/30 flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Full Inspection Report
        </motion.button>
      )}

      {/* Hypothetical Hit Section */}
      <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
        <p className="text-sm text-foreground font-rajdhani mb-4 text-center">
          Simulate what would happen if this asteroid impacted Earth
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewImpact}
          className="w-full py-3 px-4 bg-secondary border border-border hover:border-destructive text-foreground font-orbitron text-sm tracking-wider rounded transition-colors"
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
          className="text-xs text-primary hover:underline font-rajdhani"
        >
          View on NASA JPL Database →
        </a>
      </div>
    </motion.div>
  );
};
