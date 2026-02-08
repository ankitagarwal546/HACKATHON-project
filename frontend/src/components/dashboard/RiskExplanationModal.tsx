import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Gauge, AlertTriangle, Target, Info } from 'lucide-react';

interface RiskExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RiskExplanationModal = ({ isOpen, onClose }: RiskExplanationModalProps) => {
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

          {/* Modal - full screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-card border-0 rounded-none overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-orbitron text-lg text-foreground">How Risk Is Calculated</h2>
                  <p className="text-xs text-muted-foreground font-rajdhani">Asteroid Threat Assessment System</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Introduction */}
              <p className="text-muted-foreground font-rajdhani mb-6">
                Our system evaluates each asteroid using four key factors to determine its risk level. 
                Here's how we assess potential threats to Earth:
              </p>

              {/* Factors Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Size Factor */}
                <div className="bg-secondary/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Ruler className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-orbitron text-sm text-foreground">SIZE (DIAMETER)</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-rajdhani mb-2">
                    Larger asteroids carry more mass and energy upon impact.
                  </p>
                  <div className="space-y-1 text-xs font-rajdhani">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">&lt; 100m</span>
                      <span className="text-safe">Local damage</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">100-500m</span>
                      <span className="text-warning">Regional impact</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">&gt; 500m</span>
                      <span className="text-destructive">Global effects</span>
                    </div>
                  </div>
                </div>

                {/* Velocity Factor */}
                <div className="bg-secondary/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-warning/20 rounded-lg">
                      <Gauge className="w-5 h-5 text-warning" />
                    </div>
                    <h3 className="font-orbitron text-sm text-foreground">VELOCITY</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-rajdhani mb-2">
                    Impact energy increases with the square of velocity.
                  </p>
                  <div className="space-y-1 text-xs font-rajdhani">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">&lt; 15 km/s</span>
                      <span className="text-safe">Standard</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">15-25 km/s</span>
                      <span className="text-warning">Elevated</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">&gt; 25 km/s</span>
                      <span className="text-destructive">Extreme</span>
                    </div>
                  </div>
                </div>

                {/* Hazardous Classification */}
                <div className="bg-secondary/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-destructive/20 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <h3 className="font-orbitron text-sm text-foreground">HAZARDOUS CLASS</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-rajdhani mb-2">
                    NASA's Potentially Hazardous Asteroid (PHA) designation.
                  </p>
                  <div className="space-y-1 text-xs font-rajdhani">
                    <p className="text-muted-foreground">
                      PHAs are asteroids larger than 140m that pass within 7.5 million km of Earth's orbit.
                    </p>
                  </div>
                </div>

                {/* Miss Distance */}
                <div className="bg-secondary/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-safe/20 rounded-lg">
                      <Target className="w-5 h-5 text-safe" />
                    </div>
                    <h3 className="font-orbitron text-sm text-foreground">MISS DISTANCE</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-rajdhani mb-2">
                    How close the asteroid will pass to Earth.
                  </p>
                  <div className="space-y-1 text-xs font-rajdhani">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">&gt; 50M km</span>
                      <span className="text-safe">Safe margin</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">10-50M km</span>
                      <span className="text-warning">Close watch</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">&lt; 10M km</span>
                      <span className="text-destructive">Very close</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formula Visualization */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
                <h3 className="font-orbitron text-sm text-primary mb-3">RISK ASSESSMENT FORMULA</h3>
                <div className="flex flex-wrap items-center gap-2 justify-center text-sm font-rajdhani">
                  <div className="bg-card px-3 py-2 rounded border border-border">
                    <span className="text-foreground">Risk Score</span>
                  </div>
                  <span className="text-muted-foreground">=</span>
                  <div className="bg-card px-3 py-2 rounded border border-border">
                    <span className="text-primary">Size</span>
                  </div>
                  <span className="text-muted-foreground">×</span>
                  <div className="bg-card px-3 py-2 rounded border border-border">
                    <span className="text-warning">Velocity²</span>
                  </div>
                  <span className="text-muted-foreground">÷</span>
                  <div className="bg-card px-3 py-2 rounded border border-border">
                    <span className="text-safe">Distance</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3 font-rajdhani">
                  Objects are classified as LOW, MEDIUM, or HIGH risk based on this combined assessment
                </p>
              </div>

              {/* Risk Level Legend */}
              <div className="bg-secondary/30 rounded-lg p-4">
                <h3 className="font-orbitron text-sm text-foreground mb-3">RISK LEVELS</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-safe shadow-[0_0_10px_hsl(var(--safe)/0.5)]" />
                    <span className="font-orbitron text-xs text-safe">LOW</span>
                    <span className="text-xs text-muted-foreground font-rajdhani">— Safe passage expected, minimal monitoring required</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-warning shadow-[0_0_10px_hsl(var(--warning)/0.5)]" />
                    <span className="font-orbitron text-xs text-warning">MEDIUM</span>
                    <span className="text-xs text-muted-foreground font-rajdhani">— Elevated attention, regular tracking updates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-destructive shadow-[0_0_10px_hsl(var(--destructive)/0.5)]" />
                    <span className="font-orbitron text-xs text-destructive">HIGH</span>
                    <span className="text-xs text-muted-foreground font-rajdhani">— Priority monitoring, detailed trajectory analysis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-secondary/30">
              <button
                onClick={onClose}
                className="w-full py-2 bg-primary/20 border border-primary text-primary font-orbitron text-sm rounded-lg hover:bg-primary/30 transition-colors"
              >
                UNDERSTOOD
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RiskExplanationModal;
