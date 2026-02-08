import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { mockAsteroids } from '@/data/mockAsteroids';
import { Shield, AlertTriangle, Activity } from 'lucide-react';

const PlanetarySafetyIndex = () => {
  const { safetyScore, status, statusColor, glowColor } = useMemo(() => {
    // Calculate safety score based on asteroid risk factors
    const totalAsteroids = mockAsteroids.length;
    const highRiskCount = mockAsteroids.filter(a => a.riskScore === 'high').length;
    const mediumRiskCount = mockAsteroids.filter(a => a.riskScore === 'medium').length;
    const hazardousCount = mockAsteroids.filter(a => a.isHazardous).length;

    // Base score of 100, subtract based on risks
    let score = 100;
    score -= highRiskCount * 15;
    score -= mediumRiskCount * 8;
    score -= hazardousCount * 5;

    // Factor in close approaches (closer = more dangerous)
    const avgMissDistance = mockAsteroids.reduce((acc, a) => acc + a.missDistanceKm, 0) / totalAsteroids;
    if (avgMissDistance < 10000000) score -= 10;
    else if (avgMissDistance < 30000000) score -= 5;

    score = Math.max(0, Math.min(100, score));

    let statusText: string;
    let color: string;
    let glow: string;

    if (score >= 75) {
      statusText = 'SAFE';
      color = 'text-safe';
      glow = 'hsl(var(--safe))';
    } else if (score >= 40) {
      statusText = 'WATCH';
      color = 'text-warning';
      glow = 'hsl(var(--warning))';
    } else {
      statusText = 'DANGER';
      color = 'text-destructive';
      glow = 'hsl(var(--destructive))';
    }

    return { safetyScore: Math.round(score), status: statusText, statusColor: color, glowColor: glow };
  }, []);

  // Calculate circumference and offset for the circular gauge
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safetyScore / 100) * circumference;

  const getStatusIcon = () => {
    switch (status) {
      case 'DANGER': return <AlertTriangle className="w-8 h-8" />;
      case 'WATCH': return <Activity className="w-8 h-8" />;
      default: return <Shield className="w-8 h-8" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black/35 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Circular Gauge */}
        <div className="relative">
          <svg width="180" height="180" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <motion.circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={glowColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                filter: `drop-shadow(0 0 10px ${glowColor})`,
              }}
            />
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={safetyScore}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-4xl font-orbitron font-bold ${statusColor}`}
            >
              {safetyScore}
            </motion.span>
            <span className="text-xs text-gray-400 font-mono">/ 100</span>
          </div>
        </div>

        {/* Info Panel */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <div className={`p-2 rounded-lg ${status === 'SAFE' ? 'bg-safe/20' : status === 'WATCH' ? 'bg-warning/20' : 'bg-destructive/20'}`}>
              <span className={statusColor}>{getStatusIcon()}</span>
            </div>
            <div>
              <h2 className="text-lg font-orbitron font-bold text-white tracking-widest">PLANETARY SAFETY INDEX</h2>
              <p className="text-xs text-gray-400 font-mono uppercase">GLOBAL THREAT ASSESSMENT</p>
            </div>
          </div>
          
          <motion.div
            key={status}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              status === 'SAFE' ? 'bg-safe/20 border border-safe/50' :
              status === 'WATCH' ? 'bg-warning/20 border border-warning/50' :
              'bg-destructive/20 border border-destructive/50'
            }`}
            style={{
              boxShadow: `0 0 20px ${glowColor}40`,
            }}
          >
            <span className={`text-xl font-orbitron font-bold ${statusColor}`}>{status}</span>
          </motion.div>

          <p className="mt-3 text-sm text-gray-400 font-mono max-w-md">
            {status === 'SAFE' && 'All tracked near-Earth objects are within safe parameters. No immediate threats detected.'}
            {status === 'WATCH' && 'Elevated monitoring level. Some objects require continued observation.'}
            {status === 'DANGER' && 'High-risk objects detected. Enhanced monitoring protocols active.'}
          </p>

          {/* Quick Stats */}
          <div className="flex gap-4 mt-4 justify-center md:justify-start">
            <div className="text-center">
              <span className="text-lg font-orbitron font-bold text-white">{mockAsteroids.filter(a => a.riskScore === 'high').length}</span>
              <p className="text-[10px] text-gray-400 font-mono uppercase">HIGH RISK</p>
            </div>
            <div className="text-center">
              <span className="text-lg font-orbitron font-bold text-white">{mockAsteroids.filter(a => a.isHazardous).length}</span>
              <p className="text-[10px] text-gray-400 font-mono uppercase">HAZARDOUS</p>
            </div>
            <div className="text-center">
              <span className="text-lg font-orbitron font-bold text-white">{mockAsteroids.length}</span>
              <p className="text-[10px] text-gray-400 font-mono uppercase">TRACKED</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlanetarySafetyIndex;
