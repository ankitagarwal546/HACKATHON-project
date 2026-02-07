import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { SolarSystem } from '@/components/3d/SolarSystem';
import { Asteroid } from '@/types/asteroid';
import { mockAsteroids } from '@/data/mockAsteroids';
import { ArrowLeft, AlertTriangle, Shield, Info } from 'lucide-react';

const ExplorerPage = () => {
  const navigate = useNavigate();
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);

  const stats = {
    totalAsteroids: mockAsteroids.length,
    hazardous: mockAsteroids.filter(a => a.isHazardous).length,
    highRisk: mockAsteroids.filter(a => a.riskScore === 'high').length,
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      {/* 3D Canvas Container */}
      <div className="fixed inset-0 pt-16">
        <SolarSystem
          selectedAsteroid={selectedAsteroid}
          onSelectAsteroid={setSelectedAsteroid}
        />
      </div>

      {/* UI Overlays */}
      <div className="relative z-10 pt-20 px-4 pointer-events-none">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/dashboard')}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg text-foreground font-rajdhani hover:border-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </motion.button>

        {/* Info Panel - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="pointer-events-auto absolute top-28 left-4 w-64"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-primary/50 rounded-lg p-4">
            <h2 className="font-orbitron text-primary text-sm mb-3">
              NASA SOLAR EXPLORER
            </h2>
            <ul className="space-y-2 text-sm font-rajdhani text-foreground">
              <li className="flex items-center gap-2">
                <span>🪐</span> 6 Planets
              </li>
              <li className="flex items-center gap-2">
                <span>☄️</span> {stats.totalAsteroids} Tracked Asteroids
              </li>
              <li className="flex items-center gap-2">
                <span>⚠️</span> {stats.hazardous} Potentially Hazardous
              </li>
              <li className="flex items-center gap-2">
                <span>🎯</span> {stats.highRisk} High Risk
              </li>
              <li className="flex items-center gap-2">
                <span>✨</span> Glowing Orbit Rings
              </li>
              <li className="flex items-center gap-2">
                <span>📊</span> Real-time Data
              </li>
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-2 bg-primary/20 border border-primary text-primary font-orbitron text-xs rounded hover:bg-primary/30 transition-colors"
            >
              ☀️ FOLLOW SUN
            </motion.button>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pointer-events-auto fixed bottom-4 left-4"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3">
            <h3 className="font-orbitron text-xs text-muted-foreground mb-2">RISK LEGEND</h3>
            <div className="flex gap-4 text-xs font-rajdhani">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-safe" />
                <span className="text-safe">Low Risk</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-warning">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-destructive">High Risk</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Selected Asteroid Details */}
        {selectedAsteroid && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="pointer-events-auto fixed top-28 right-4 w-72"
          >
            <div className="bg-card/90 backdrop-blur-sm border border-primary rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-orbitron text-primary text-sm">
                  {selectedAsteroid.name}
                </h3>
                {selectedAsteroid.isHazardous ? (
                  <AlertTriangle className="w-5 h-5 text-warning" />
                ) : (
                  <Shield className="w-5 h-5 text-safe" />
                )}
              </div>

              <div className="space-y-2 text-sm font-rajdhani">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diameter:</span>
                  <span className="text-foreground">
                    {Math.round((selectedAsteroid.diameterMin + selectedAsteroid.diameterMax) / 2)}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Velocity:</span>
                  <span className="text-foreground">{selectedAsteroid.velocityKmps.toFixed(2)} km/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Miss Distance:</span>
                  <span className="text-foreground">{(selectedAsteroid.missDistanceKm / 1000000).toFixed(2)}M km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Close Approach:</span>
                  <span className="text-foreground">
                    {new Date(selectedAsteroid.closeApproachDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-orbitron ${
                    selectedAsteroid.riskScore === 'high' ? 'bg-destructive/20 text-destructive' :
                    selectedAsteroid.riskScore === 'medium' ? 'bg-warning/20 text-warning' :
                    'bg-safe/20 text-safe'
                  }`}>
                    {selectedAsteroid.riskScore.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedAsteroid(null)}
                className="w-full mt-4 py-2 text-xs font-rajdhani text-muted-foreground hover:text-foreground transition-colors"
              >
                Click anywhere to deselect
              </button>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pointer-events-auto fixed bottom-4 right-4"
        >
          <div className="bg-card/60 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <span className="text-xs font-rajdhani text-muted-foreground">
              Scroll to zoom • Drag to rotate • Click asteroids for details
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExplorerPage;
