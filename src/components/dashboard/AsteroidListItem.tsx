import { Asteroid } from '@/types/asteroid';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, Shield } from 'lucide-react';

interface AsteroidListItemProps {
  asteroid: Asteroid;
  isSelected: boolean;
  onClick: () => void;
}

export const AsteroidListItem = ({ asteroid, isSelected, onClick }: AsteroidListItemProps) => {
  const getRiskIcon = () => {
    switch (asteroid.riskScore) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'medium':
        return <Info className="w-4 h-4 text-warning" />;
      default:
        return <Shield className="w-4 h-4 text-safe" />;
    }
  };

  return (
    <motion.button
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left p-4 border transition-all duration-200 rounded-lg ${
        isSelected
          ? 'border-primary bg-primary/10 glow-border'
          : 'border-border hover:border-primary/50 bg-card/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-rajdhani text-sm md:text-base text-foreground truncate pr-2">
          {asteroid.name}
        </span>
        {getRiskIcon()}
      </div>
      <div className="flex items-center gap-2 mt-1">
        {asteroid.isHazardous && (
          <span className="text-xs px-2 py-0.5 bg-destructive/20 text-destructive rounded font-rajdhani">
            HAZARDOUS
          </span>
        )}
        <span className="text-xs text-muted-foreground font-rajdhani">
          {new Date(asteroid.closeApproachDate).toLocaleDateString()}
        </span>
      </div>
    </motion.button>
  );
};
