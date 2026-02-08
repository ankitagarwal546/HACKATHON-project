import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Activity, Clock, Target, Radio } from 'lucide-react';

export interface SystemStatusBarProps {
  totalAsteroids?: number;
  highRiskCount?: number;
  mediumRiskCount?: number;
  nextApproachDate?: string | null;
}

const SystemStatusBar = ({ totalAsteroids, highRiskCount = 0, mediumRiskCount = 0, nextApproachDate }: SystemStatusBarProps = {}) => {
  const [lastScanTime, setLastScanTime] = useState(new Date());
  const [countdown, setCountdown] = useState('—');

  const threatLevel =
    totalAsteroids == null
      ? '—'
      : highRiskCount >= 2
        ? 'HIGH'
        : highRiskCount >= 1 || mediumRiskCount >= 3
          ? 'ELEVATED'
          : 'LOW';

  useEffect(() => {
    if (!nextApproachDate) {
      setCountdown('—');
      return;
    }
    const updateCountdown = () => {
      const now = new Date();
      const approachDate = new Date(nextApproachDate);
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
  }, [nextApproachDate]);

  // Update last scan time every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastScanTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getThreatColor = () => {
    switch (threatLevel) {
      case 'HIGH': return 'text-red-400';
      case 'ELEVATED': return 'text-amber-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getThreatGlow = () => {
    switch (threatLevel) {
      case 'HIGH': return 'shadow-[0_0_10px_rgba(248,113,113,0.5)]';
      case 'ELEVATED': return 'shadow-[0_0_10px_rgba(251,191,36,0.5)]';
      case 'LOW': return 'shadow-[0_0_10px_rgba(74,222,128,0.5)]';
      default: return '';
    }
  };

  const getThreatBg = () => {
    switch (threatLevel) {
      case 'HIGH': return 'bg-red-500/20';
      case 'ELEVATED': return 'bg-amber-500/20';
      case 'LOW': return 'bg-green-500/20';
      default: return 'bg-black/25';
    }
  };

  const getThreatIcon = () => {
    switch (threatLevel) {
      case 'HIGH': return <AlertTriangle className="w-4 h-4" />;
      case 'ELEVATED': return <Activity className="w-4 h-4" />;
      case 'LOW': return <Shield className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-16 left-0 right-0 z-40 bg-black/35 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* System Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            </div>
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">SYSTEM ACTIVE</span>
          </div>

          {/* Earth Threat Level */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-sm ${getThreatBg()} ${getThreatGlow()}`}>
            <span className={getThreatColor()}>{getThreatIcon()}</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-mono uppercase">EARTH THREAT</span>
              <span className={`text-sm font-orbitron font-bold ${getThreatColor()}`}>{threatLevel}</span>
            </div>
          </div>

          {/* Last Scan Time */}
          <div className="flex items-center gap-2 px-3 py-1 bg-black/25 border border-white/10 rounded-sm">
            <Clock className="w-4 h-4 text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-mono uppercase">LAST SCAN</span>
              <span className="text-xs font-orbitron text-white">
                {lastScanTime.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Active Objects Count */}
          <div className="flex items-center gap-2 px-3 py-1 bg-black/25 border border-white/10 rounded-sm">
            <Target className="w-4 h-4 text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-mono uppercase">ACTIVE OBJECTS</span>
              <span className="text-xs font-orbitron text-white">{totalAsteroids ?? '—'}</span>
            </div>
          </div>

          {/* Next Close Approach Countdown */}
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-sm">
            <Activity className="w-4 h-4 text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-mono uppercase">NEXT APPROACH</span>
              <span className="text-xs font-orbitron text-cyan-400 font-bold">{countdown}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemStatusBar;
