import { Asteroid } from '@/types/asteroid';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface AsteroidDetailsPanelProps {
  asteroid: Asteroid | null;
  onViewImpact: () => void;
}

export const AsteroidDetailsPanel = ({ asteroid, onViewImpact }: AsteroidDetailsPanelProps) => {
  if (!asteroid) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <p className="text-muted-foreground font-rajdhani text-center">
          Click on an Asteroid to the left, and monitor their properties in the table below
        </p>
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

      {/* Hypothetical Hit Section */}
      <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
        <p className="text-sm text-foreground font-rajdhani mb-4 text-center">
          Click this button to view see what would happen if this Asteroid hit Earth.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewImpact}
          className="w-full py-3 px-4 bg-secondary border border-border hover:border-destructive text-foreground font-orbitron text-sm tracking-wider rounded transition-colors"
        >
          Hypothetical hit
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
