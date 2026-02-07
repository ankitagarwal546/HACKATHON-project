import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import SystemStatusBar from '@/components/SystemStatusBar';
import { SolarSystem } from '@/components/3d/SolarSystem';
import { Asteroid } from '@/types/asteroid';
import { mockAsteroids } from '@/data/mockAsteroids';
import { ArrowLeft, AlertTriangle, Shield, Info, ExternalLink, Calendar, Gauge, Target, Crosshair } from 'lucide-react';

const ExplorerPage = () => {
  const navigate = useNavigate();
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);

  const stats = {
    totalAsteroids: mockAsteroids.length,
    hazardous: mockAsteroids.filter(a => a.isHazardous).length,
    highRisk: mockAsteroids.filter(a => a.riskScore === 'high').length,
  };

  const getOrbitClassification = (asteroid: Asteroid) => {
    const avgDiameter = (asteroid.diameterMin + asteroid.diameterMax) / 2;
    if (asteroid.isHazardous && avgDiameter > 500) return 'Apollo-class PHA';
    if (asteroid.isHazardous) return 'Near-Earth PHA';
    if (avgDiameter > 300) return 'Main Belt Crosser';
    return 'Near-Earth Object';
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      <SystemStatusBar />
      
      {/* 3D Canvas Container */}
      <div className="fixed inset-0 pt-28">
        <SolarSystem
          selectedAsteroid={selectedAsteroid}
          onSelectAsteroid={setSelectedAsteroid}
        />
      </div>

      {/* UI Overlays */}
      <div className="relative z-10 pt-32 px-4 pointer-events-none">
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
          className="pointer-events-auto absolute top-40 left-4 w-72"
        >
          <div className="bg-card/90 backdrop-blur-sm border border-primary/50 rounded-lg overflow-hidden">
            <div className="bg-secondary/80 border-b border-primary/30 px-4 py-2">
              <h2 className="font-orbitron text-primary text-sm flex items-center gap-2">
                <Crosshair className="w-4 h-4" />
                ORBITAL SIMULATION
              </h2>
            </div>
            <div className="p-4">
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
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-2 bg-primary/20 border border-primary text-primary font-orbitron text-xs rounded hover:bg-primary/30 transition-colors"
              >
                ☀️ CENTER ON SUN
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Selected Asteroid Details Panel - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="pointer-events-auto fixed top-40 right-4 w-80"
        >
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
            <div className="bg-secondary/80 border-b border-border px-4 py-2">
              <h3 className="font-orbitron text-sm text-foreground flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                OBJECT DETAILS
              </h3>
            </div>
            
            {selectedAsteroid ? (
              <div className="p-4">
                {/* Header with name and status */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-orbitron text-primary text-sm">
                      {selectedAsteroid.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground font-rajdhani">
                      ID: {selectedAsteroid.nasaId}
                    </p>
                  </div>
                  {selectedAsteroid.isHazardous ? (
                    <div className="p-1.5 bg-destructive/20 rounded">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    </div>
                  ) : (
                    <div className="p-1.5 bg-safe/20 rounded">
                      <Shield className="w-4 h-4 text-safe" />
                    </div>
                  )}
                </div>

                {/* Orbit Classification */}
                <div className="bg-secondary/50 rounded-lg p-3 mb-4">
                  <span className="text-[10px] text-muted-foreground font-rajdhani">ORBIT CLASSIFICATION</span>
                  <p className="text-sm font-orbitron text-foreground">
                    {getOrbitClassification(selectedAsteroid)}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-secondary/30 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3 text-primary" />
                      <span className="text-[10px] text-muted-foreground font-rajdhani">APPROACH</span>
                    </div>
                    <p className="text-xs font-orbitron text-foreground">
                      {new Date(selectedAsteroid.closeApproachDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Gauge className="w-3 h-3 text-primary" />
                      <span className="text-[10px] text-muted-foreground font-rajdhani">VELOCITY</span>
                    </div>
                    <p className="text-xs font-orbitron text-foreground">
                      {selectedAsteroid.velocityKmps.toFixed(1)} km/s
                    </p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="w-3 h-3 text-primary" />
                      <span className="text-[10px] text-muted-foreground font-rajdhani">DISTANCE</span>
                    </div>
                    <p className="text-xs font-orbitron text-foreground">
                      {(selectedAsteroid.missDistanceKm / 1000000).toFixed(2)}M km
                    </p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-2">
                    <span className="text-[10px] text-muted-foreground font-rajdhani">DIAMETER</span>
                    <p className="text-xs font-orbitron text-foreground">
                      ~{Math.round((selectedAsteroid.diameterMin + selectedAsteroid.diameterMax) / 2)}m
                    </p>
                  </div>
                </div>

                {/* Risk Level */}
                <div className={`rounded-lg p-3 mb-4 ${
                  selectedAsteroid.riskScore === 'high' ? 'bg-destructive/20 border border-destructive/30' :
                  selectedAsteroid.riskScore === 'medium' ? 'bg-warning/20 border border-warning/30' :
                  'bg-safe/20 border border-safe/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-rajdhani">RISK LEVEL</span>
                    <span className={`font-orbitron text-sm ${
                      selectedAsteroid.riskScore === 'high' ? 'text-destructive' :
                      selectedAsteroid.riskScore === 'medium' ? 'text-warning' :
                      'text-safe'
                    }`}>
                      {selectedAsteroid.riskScore.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/asteroid/${selectedAsteroid.id}`)}
                  className="w-full py-2 bg-primary/20 border border-primary text-primary font-orbitron text-xs rounded-lg hover:bg-primary/30 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  FULL INSPECTION
                </button>

                <button
                  onClick={() => setSelectedAsteroid(null)}
                  className="w-full mt-2 py-2 text-xs font-rajdhani text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear selection
                </button>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary/50 flex items-center justify-center">
                  <Crosshair className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-rajdhani">
                  Click on an asteroid in the 3D view to inspect its details
                </p>
              </div>
            )}
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
                <div className="w-3 h-3 rounded-full bg-safe shadow-[0_0_8px_hsl(var(--safe)/0.5)]" />
                <span className="text-safe">Low Risk</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-warning shadow-[0_0_8px_hsl(var(--warning)/0.5)]" />
                <span className="text-warning">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-destructive shadow-[0_0_8px_hsl(var(--destructive)/0.5)]" />
                <span className="text-destructive">High Risk</span>
              </div>
            </div>
          </div>
        </motion.div>

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
