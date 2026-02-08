import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import SystemStatusBar from '@/components/SystemStatusBar';
import { useAsteroidLookup } from '@/hooks/useAsteroidLookup';
import { ArrowLeft, AlertTriangle, Shield, Calendar, Gauge, Ruler, Target, Info, Building2, Bus, Home } from 'lucide-react';

const AsteroidInspectionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { asteroid, loading, error } = useAsteroidLookup(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground font-rajdhani">Loading asteroid data…</div>
      </div>
    );
  }

  if (error || !asteroid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-orbitron text-destructive mb-4">OBJECT NOT FOUND</h1>
          {error && <p className="text-muted-foreground mb-4">{error}</p>}
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-primary/20 border border-primary text-primary rounded-lg font-rajdhani"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const avgDiameter = (asteroid.diameterMin + asteroid.diameterMax) / 2;

  // Size comparison logic
  const getSizeComparison = () => {
    if (avgDiameter < 10) {
      return { icon: Bus, label: 'School Bus', comparison: `About the size of ${Math.round(avgDiameter / 12)} school buses` };
    } else if (avgDiameter < 50) {
      return { icon: Home, label: 'House', comparison: `Comparable to ${Math.round(avgDiameter / 15)} residential homes stacked` };
    } else if (avgDiameter < 200) {
      return { icon: Building2, label: 'Building', comparison: `Height of a ${Math.round(avgDiameter / 4)}-story skyscraper` };
    } else if (avgDiameter < 500) {
      return { icon: Building2, label: 'City Block', comparison: `Could cover ${Math.round(avgDiameter / 100)} city blocks` };
    } else {
      return { icon: Building2, label: 'Stadium', comparison: `Would dwarf multiple football stadiums` };
    }
  };

  const sizeComparison = getSizeComparison();

  // Human-readable risk explanation
  const getRiskExplanation = () => {
    if (asteroid.riskScore === 'high') {
      return {
        title: 'High Priority Monitoring',
        description: `This asteroid requires close attention. With a diameter of approximately ${Math.round(avgDiameter)} meters and traveling at ${asteroid.velocityKmps.toFixed(1)} km/s, it possesses significant kinetic energy. Its relatively close approach distance of ${(asteroid.missDistanceKm / 1000000).toFixed(2)} million kilometers means trajectory predictions must remain precise.`,
        advice: 'While not on a collision course, continued monitoring is essential to refine trajectory predictions and ensure public safety.',
      };
    } else if (asteroid.riskScore === 'medium') {
      return {
        title: 'Elevated Watch Status',
        description: `This asteroid is under routine observation. At ${Math.round(avgDiameter)} meters in diameter, it's large enough to cause regional damage if it were to impact. However, its predicted miss distance provides a comfortable safety margin.`,
        advice: 'Regular tracking updates confirm this object poses no immediate threat, but its hazardous classification warrants ongoing surveillance.',
      };
    } else {
      return {
        title: 'Low Concern Level',
        description: `This asteroid presents minimal risk to Earth. Its moderate size and significant miss distance of ${(asteroid.missDistanceKm / 1000000).toFixed(2)} million kilometers place it well outside concerning parameters.`,
        advice: 'Standard tracking protocols are sufficient. This object is cataloged for scientific purposes rather than safety concerns.',
      };
    }
  };

  const riskExplanation = getRiskExplanation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SystemStatusBar />

      <div className="pt-32 pb-8 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors font-rajdhani"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${asteroid.isHazardous ? 'bg-destructive/20' : 'bg-safe/20'}`}>
                {asteroid.isHazardous ? (
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                ) : (
                  <Shield className="w-8 h-8 text-safe" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-orbitron text-foreground">{asteroid.name}</h1>
                <p className="text-sm text-muted-foreground font-rajdhani">NASA ID: {asteroid.nasaId}</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg ${
              asteroid.riskScore === 'high' ? 'bg-destructive/20 border border-destructive/50' :
              asteroid.riskScore === 'medium' ? 'bg-warning/20 border border-warning/50' :
              'bg-safe/20 border border-safe/50'
            }`}>
              <span className={`font-orbitron text-lg ${
                asteroid.riskScore === 'high' ? 'text-destructive' :
                asteroid.riskScore === 'medium' ? 'text-warning' :
                'text-safe'
              }`}>
                {asteroid.riskScore.toUpperCase()} RISK
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground font-rajdhani">CLOSE APPROACH</span>
            </div>
            <p className="text-lg font-orbitron text-foreground">
              {new Date(asteroid.closeApproachDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground font-rajdhani">MISS DISTANCE</span>
            </div>
            <p className="text-lg font-orbitron text-foreground">
              {(asteroid.missDistanceKm / 1000000).toFixed(2)} <span className="text-sm text-muted-foreground">million km</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <Gauge className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground font-rajdhani">VELOCITY</span>
            </div>
            <p className="text-lg font-orbitron text-foreground">
              {asteroid.velocityKmps.toFixed(2)} <span className="text-sm text-muted-foreground">km/s</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <Ruler className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground font-rajdhani">DIAMETER</span>
            </div>
            <p className="text-lg font-orbitron text-foreground">
              {asteroid.diameterMin.toFixed(0)} - {asteroid.diameterMax.toFixed(0)} <span className="text-sm text-muted-foreground">meters</span>
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Size Comparison */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6"
          >
            <h2 className="font-orbitron text-lg text-foreground mb-4">SIZE COMPARISON</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                {/* Asteroid visualization */}
                <div 
                  className="bg-gradient-to-br from-muted to-secondary rounded-full flex items-center justify-center border border-border"
                  style={{
                    width: Math.min(120, Math.max(40, avgDiameter / 10)),
                    height: Math.min(120, Math.max(40, avgDiameter / 10)),
                  }}
                >
                  <span className="text-xs font-orbitron text-muted-foreground">
                    ~{Math.round(avgDiameter)}m
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <sizeComparison.icon className="w-6 h-6 text-primary" />
                  <span className="font-orbitron text-sm text-primary">{sizeComparison.label}</span>
                </div>
                <p className="text-muted-foreground font-rajdhani">{sizeComparison.comparison}</p>
                
                {/* Visual scale */}
                <div className="mt-4 flex items-end gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-6 bg-primary/30 rounded" />
                    <span className="text-[10px] text-muted-foreground mt-1">Bus</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-10 bg-primary/40 rounded" />
                    <span className="text-[10px] text-muted-foreground mt-1">House</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-16 bg-primary/50 rounded" />
                    <span className="text-[10px] text-muted-foreground mt-1">Tower</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className="bg-warning/60 rounded"
                      style={{
                        width: Math.min(32, Math.max(8, avgDiameter / 50)),
                        height: Math.min(80, Math.max(20, avgDiameter / 15)),
                      }}
                    />
                    <span className="text-[10px] text-warning mt-1">This</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Human Readable Risk Explanation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className={`backdrop-blur-sm border rounded-xl p-6 ${
              asteroid.riskScore === 'high' ? 'bg-destructive/10 border-destructive/30' :
              asteroid.riskScore === 'medium' ? 'bg-warning/10 border-warning/30' :
              'bg-safe/10 border-safe/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Info className={`w-5 h-5 ${
                asteroid.riskScore === 'high' ? 'text-destructive' :
                asteroid.riskScore === 'medium' ? 'text-warning' :
                'text-safe'
              }`} />
              <h2 className="font-orbitron text-lg text-foreground">RISK ASSESSMENT</h2>
            </div>
            
            <h3 className={`font-orbitron text-sm mb-2 ${
              asteroid.riskScore === 'high' ? 'text-destructive' :
              asteroid.riskScore === 'medium' ? 'text-warning' :
              'text-safe'
            }`}>
              {riskExplanation.title}
            </h3>
            
            <p className="text-muted-foreground font-rajdhani text-sm mb-4">
              {riskExplanation.description}
            </p>
            
            <div className="bg-card/50 rounded-lg p-3 border border-border">
              <p className="text-xs text-foreground font-rajdhani">
                <span className="text-primary font-orbitron">BOTTOM LINE: </span>
                {riskExplanation.advice}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Additional Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6"
        >
          <h2 className="font-orbitron text-lg text-foreground mb-4">TECHNICAL SPECIFICATIONS</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <span className="text-xs text-muted-foreground font-rajdhani">ABSOLUTE MAGNITUDE</span>
              <p className="text-lg font-orbitron text-foreground">{asteroid.absoluteMagnitude}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-rajdhani">ORBITING BODY</span>
              <p className="text-lg font-orbitron text-foreground">{asteroid.orbitingBody}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-rajdhani">HAZARDOUS CLASSIFICATION</span>
              <p className={`text-lg font-orbitron ${asteroid.isHazardous ? 'text-destructive' : 'text-safe'}`}>
                {asteroid.isHazardous ? 'POTENTIALLY HAZARDOUS' : 'NON-HAZARDOUS'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AsteroidInspectionPage;
