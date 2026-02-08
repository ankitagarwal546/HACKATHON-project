import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import SystemStatusBar from '@/components/SystemStatusBar';
import { SolarSystem } from '@/components/3d/SolarSystem';
import { Asteroid } from '@/types/asteroid';
import { useAsteroidFeed } from '@/hooks/useAsteroidFeed';
import { ArrowLeft, AlertTriangle, Shield, Info, ExternalLink, Calendar, Gauge, Target, Crosshair } from 'lucide-react';

const ExplorerPage = () => {
  const navigate = useNavigate();
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const { asteroids: feedAsteroids, totalElements } = useAsteroidFeed();

  const nextApproachDate = useMemo(() => {
    const now = new Date();
    const future = feedAsteroids
      .filter((a) => new Date(a.closeApproachDate).getTime() > now.getTime())
      .sort((a, b) => new Date(a.closeApproachDate).getTime() - new Date(b.closeApproachDate).getTime());
    return future[0]?.closeApproachDate ?? null;
  }, [feedAsteroids]);

  const stats = useMemo(() => ({
    totalAsteroids: totalElements,
    hazardous: feedAsteroids.filter((a) => a.isHazardous).length,
    highRisk: feedAsteroids.filter((a) => a.riskScore === 'high').length,
  }), [totalElements, feedAsteroids]);

  const getOrbitClassification = (asteroid: Asteroid) => {
    const avgDiameter = (asteroid.diameterMin + asteroid.diameterMax) / 2;
    if (asteroid.isHazardous && avgDiameter > 500) return 'Apollo-class PHA';
    if (asteroid.isHazardous) return 'Near-Earth PHA';
    if (avgDiameter > 300) return 'Main Belt Crosser';
    return 'Near-Earth Object';
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      <SystemStatusBar
        totalAsteroids={totalElements}
        highRiskCount={stats.highRisk}
        mediumRiskCount={feedAsteroids.filter((a) => a.riskScore === 'medium').length}
        nextApproachDate={nextApproachDate}
      />

      {/* 3D Canvas Container */}
      <div className="fixed inset-0 pt-28">
        <SolarSystem />
      </div>

      {/* UI Overlays - Back Button Only */}
      <div className="absolute top-24 right-4 z-10 pointer-events-none">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/dashboard')}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm text-white font-mono text-xs uppercase tracking-wider hover:border-cyan-500/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </motion.button>
      </div>
    </div>
  );
};

export default ExplorerPage;
