import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockAsteroids } from '@/data/mockAsteroids';
import { Shield, AlertTriangle, Activity, Clock, Target, Radio } from 'lucide-react';

const SystemStatusBar = () => {
  const [lastScanTime, setLastScanTime] = useState(new Date());
  const [countdown, setCountdown] = useState('');

  // Calculate threat level based on asteroid risk scores
  const calculateThreatLevel = () => {
    const highRiskCount = mockAsteroids.filter(a => a.riskScore === 'high').length;
    const mediumRiskCount = mockAsteroids.filter(a => a.riskScore === 'medium').length;
    
    if (highRiskCount >= 2) return 'HIGH';
    if (highRiskCount >= 1 || mediumRiskCount >= 3) return 'ELEVATED';
    return 'LOW';
  };

  const threatLevel = calculateThreatLevel();

  // Find next close approach
  const getNextCloseApproach = () => {
    const now = new Date();
    const futureAsteroids = mockAsteroids
      .filter(a => new Date(a.closeApproachDate) > now)
      .sort((a, b) => new Date(a.closeApproachDate).getTime() - new Date(b.closeApproachDate).getTime());
    
    return futureAsteroids[0] || mockAsteroids[0];
  };

  const nextApproach = getNextCloseApproach();

  // Update countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const approachDate = new Date(nextApproach.closeApproachDate);
      const diff = approachDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown('IMMINENT');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextApproach]);

  // Update last scan time every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastScanTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getThreatColor = () => {
    switch (threatLevel) {
      case 'HIGH': return 'text-destructive';
      case 'ELEVATED': return 'text-warning';
      default: return 'text-safe';
    }
  };

  const getThreatGlow = () => {
    switch (threatLevel) {
      case 'HIGH': return 'shadow-[0_0_10px_hsl(var(--destructive)/0.5)]';
      case 'ELEVATED': return 'shadow-[0_0_10px_hsl(var(--warning)/0.5)]';
      default: return 'shadow-[0_0_10px_hsl(var(--safe)/0.5)]';
    }
  };

  const getThreatBg = () => {
    switch (threatLevel) {
      case 'HIGH': return 'bg-destructive/20';
      case 'ELEVATED': return 'bg-warning/20';
      default: return 'bg-safe/20';
    }
  };

  const getThreatIcon = () => {
    switch (threatLevel) {
      case 'HIGH': return <AlertTriangle className="w-4 h-4" />;
      case 'ELEVATED': return <Activity className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-16 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* System Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Radio className="w-4 h-4 text-primary animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-safe rounded-full animate-ping" />
            </div>
            <span className="text-xs font-orbitron text-muted-foreground">SYSTEM ACTIVE</span>
          </div>

          {/* Earth Threat Level */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${getThreatBg()} ${getThreatGlow()}`}>
            <span className={getThreatColor()}>{getThreatIcon()}</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground font-rajdhani">EARTH THREAT</span>
              <span className={`text-sm font-orbitron font-bold ${getThreatColor()}`}>{threatLevel}</span>
            </div>
          </div>

          {/* Last Scan Time */}
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-lg">
            <Clock className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground font-rajdhani">LAST SCAN</span>
              <span className="text-xs font-orbitron text-foreground">
                {lastScanTime.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Active Objects Count */}
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-lg">
            <Target className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground font-rajdhani">ACTIVE OBJECTS</span>
              <span className="text-xs font-orbitron text-foreground">{mockAsteroids.length}</span>
            </div>
          </div>

          {/* Next Close Approach Countdown */}
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-lg">
            <Activity className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground font-rajdhani">NEXT APPROACH</span>
              <span className="text-xs font-orbitron text-primary font-bold">{countdown}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemStatusBar;
