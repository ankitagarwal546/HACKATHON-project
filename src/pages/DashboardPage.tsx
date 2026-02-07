import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import SystemStatusBar from '@/components/SystemStatusBar';
import PlanetarySafetyIndex from '@/components/dashboard/PlanetarySafetyIndex';
import RiskExplanationModal from '@/components/dashboard/RiskExplanationModal';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { AsteroidListItem } from '@/components/dashboard/AsteroidListItem';
import { AsteroidDetailsPanel } from '@/components/dashboard/AsteroidDetailsPanel';
import { ImpactModal } from '@/components/dashboard/ImpactModal';
import { getAsteroidsByMonth, calculateImpactScenario } from '@/data/mockAsteroids';
import { Asteroid, ImpactScenario } from '@/types/asteroid';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Globe, LayoutDashboard, LogOut, HelpCircle } from 'lucide-react';
import { useAlertNotifications } from '@/hooks/useAlertNotifications';

const DashboardPage = () => {
  const navigate = useNavigate();
  const asteroidGroups = useMemo(() => getAsteroidsByMonth(), []);
  
  // Trigger alert notifications on mount
  useAlertNotifications();
  
  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    asteroidGroups.length > 0 ? `${asteroidGroups[0].month} ${asteroidGroups[0].year}` : null
  );
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [impactScenario, setImpactScenario] = useState<ImpactScenario | null>(null);
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);

  const currentAsteroids = useMemo(() => {
    if (!selectedMonth) return [];
    const group = asteroidGroups.find(g => `${g.month} ${g.year}` === selectedMonth);
    return group?.asteroids || [];
  }, [selectedMonth, asteroidGroups]);

  const handleViewImpact = () => {
    if (selectedAsteroid) {
      const scenario = calculateImpactScenario(selectedAsteroid);
      setImpactScenario(scenario);
      setShowImpactModal(true);
    }
  };

  const handleAsteroidClick = (asteroid: Asteroid) => {
    setSelectedAsteroid(asteroid);
  };

  const handleInspectAsteroid = () => {
    if (selectedAsteroid) {
      navigate(`/asteroid/${selectedAsteroid.id}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SystemStatusBar />
      
      {/* Dashboard Content */}
      <div className="pt-32 pb-8 px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-orbitron text-foreground">NEO MONITORING DASHBOARD</h1>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRiskModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-muted-foreground font-rajdhani hover:text-foreground hover:border-primary transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden md:inline text-sm">How Risk Is Calculated</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/explorer')}
              className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/50 rounded-lg text-primary font-rajdhani hover:bg-primary/30 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden md:inline">3D Explorer</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/20 border border-destructive/50 rounded-lg text-destructive font-rajdhani hover:bg-destructive/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Planetary Safety Index Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <PlanetarySafetyIndex />
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel - Month Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground font-rajdhani mb-4">
                Asteroids segregated by closest approach date to Earth
              </p>
              <MonthSelector
                groups={asteroidGroups}
                selectedMonth={selectedMonth}
                onSelectMonth={setSelectedMonth}
              />

              {/* ISS Live Feed Section */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-orbitron text-lg text-foreground mb-2">
                  Live from the ISS
                </h3>
                <p className="text-xs text-muted-foreground font-rajdhani mb-3">
                  Live video from the International Space Station
                </p>
                <div className="aspect-video bg-secondary rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.youtube.com/embed/P9C25Un7xaM?autoplay=0&mute=1"
                    title="ISS Live"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Middle Panel - Asteroid List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground font-rajdhani">
                  Click an asteroid card for inspection. View full details page for risk analysis.
                </p>
                <span className="text-primary text-xl">▼</span>
              </div>
              
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {currentAsteroids.map((asteroid) => (
                    <AsteroidListItem
                      key={asteroid.id}
                      asteroid={asteroid}
                      isSelected={selectedAsteroid?.id === asteroid.id}
                      onClick={() => handleAsteroidClick(asteroid)}
                    />
                  ))}
                  {currentAsteroids.length === 0 && (
                    <p className="text-center text-muted-foreground py-8 font-rajdhani">
                      Select a month to view asteroids
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </motion.div>

          {/* Right Panel - Asteroid Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 h-full">
              <AsteroidDetailsPanel
                asteroid={selectedAsteroid}
                onViewImpact={handleViewImpact}
                onInspect={handleInspectAsteroid}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Impact Modal */}
      <ImpactModal
        scenario={impactScenario}
        isOpen={showImpactModal}
        onClose={() => setShowImpactModal(false)}
      />

      {/* Risk Explanation Modal */}
      <RiskExplanationModal
        isOpen={showRiskModal}
        onClose={() => setShowRiskModal(false)}
      />
    </div>
  );
};

export default DashboardPage;
