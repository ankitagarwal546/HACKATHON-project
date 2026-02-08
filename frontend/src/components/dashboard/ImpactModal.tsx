import { ImpactScenario } from '@/types/asteroid';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ImpactModalProps {
  scenario: ImpactScenario | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ImpactModal = ({ scenario, isOpen, onClose }: ImpactModalProps) => {
  if (!scenario) return null;

  const avgDiameter = Math.round((scenario.asteroid.diameterMin + scenario.asteroid.diameterMax) / 2);
  const velocity = Math.round(scenario.asteroid.velocity);

  const getThreatColor = () => {
    switch (scenario.threatLevel) {
      case 'extinction':
        return 'from-destructive to-destructive/50';
      case 'global':
        return 'from-destructive/80 to-warning/50';
      case 'regional':
        return 'from-warning to-warning/50';
      default:
        return 'from-safe to-safe/50';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl z-50"
          >
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
              {/* Header with gradient */}
              <div className={`h-2 bg-gradient-to-r ${getThreatColor()}`} />
              
              <div className="p-6 md:p-8">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-orbitron text-foreground mb-6 pr-8">
                  Hypothetical scenario if{' '}
                  <span className="text-primary">{scenario.asteroid.name}</span> hit Earth
                </h2>

                {/* Stats */}
                <div className="mb-6">
                  <p className="font-rajdhani text-foreground">
                    This asteroid has an estimated diameter of{' '}
                    <span className="text-destructive font-semibold">{avgDiameter}</span>
                    {' '}Meters, going at a speed of{' '}
                    <span className="text-destructive font-semibold">{velocity.toLocaleString()} MPH</span>.
                  </p>
                  <p className="font-rajdhani text-muted-foreground mt-2">
                    {scenario.description}
                  </p>
                </div>

                {/* Warning/Safe banner */}
                <div className={`p-4 rounded-lg mb-6 ${
                  scenario.asteroid.isHazardous 
                    ? 'bg-warning/20 border border-warning/50' 
                    : 'bg-warning/20 border border-warning/50'
                }`}>
                  <p className="text-center font-rajdhani text-lg font-semibold text-background">
                    <span className="bg-warning text-warning-foreground px-4 py-2 rounded">
                      Don't lose sleep over it, this Asteroid currently poses no threat to Earth!
                    </span>
                  </p>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-secondary rounded-lg">
                    <span className="text-muted-foreground font-rajdhani">Impact Energy</span>
                    <p className="text-foreground font-orbitron">{scenario.impactEnergy} MT</p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <span className="text-muted-foreground font-rajdhani">Crater Diameter</span>
                    <p className="text-foreground font-orbitron">{scenario.craterDiameter} km</p>
                  </div>
                </div>

                {/* Origin question */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-orbitron text-lg text-foreground mb-2">
                    So where do these Asteroids come from?
                  </h3>
                  <p className="text-sm text-muted-foreground font-rajdhani">
                    Most near-Earth asteroids originate from the asteroid belt between Mars and Jupiter. 
                    Gravitational perturbations from Jupiter can alter their orbits, sending some on 
                    trajectories that bring them closer to Earth.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
