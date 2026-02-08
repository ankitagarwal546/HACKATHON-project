import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Radar,
  Globe,
  ShieldAlert,
  MessageSquareDiff,
  ChevronRight,
  Activity,
  Terminal,
} from 'lucide-react';
import CosmicSpaceScene from '@/components/3d/CosmicSpaceScene';

interface LandingStats {
  totalNEOs: number;
  hazardousCount: number;
  closestApproachLD: number | null;
  socketCount: number;
}

function InfoCard({
  label,
  value,
  sub,
  icon,
  delay,
  extra,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  delay: number;
  extra?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="p-4 border-l-2 border-white/10 bg-black/60 backdrop-blur-md hover:border-cyan-500/50 hover:bg-black/80 transition-all group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          {label}
        </span>
        {icon}
      </div>
      <div className="flex items-center min-h-[2rem]">
        <div className="text-2xl font-bold text-white font-sans tracking-tight group-hover:text-cyan-400 transition-colors min-w-[2ch]">
          {value || '\u00A0'}
        </div>
        {extra}
      </div>
      <div className="text-[10px] text-gray-400 mt-1 font-mono">{sub}</div>
    </motion.div>
  );
}

const getApiBase = (): string => {
  const env = import.meta.env.VITE_API_BASE_URL;
  if (env) return (env as string).replace(/\/$/, '');
  return '';
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<LandingStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const base = getApiBase();
    const url = base ? `${base}/api/stats` : '/api/stats';
    fetch(url, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (data?.success) {
          setStats({
            totalNEOs: data.totalNEOs ?? 0,
            hazardousCount: data.hazardousCount ?? 0,
            closestApproachLD: data.closestApproachLD ?? null,
            socketCount: data.socketCount ?? 0,
          });
        }
      })
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, []);

  const formatNumber = (n: number) => n.toLocaleString();
  const placeholder = statsLoading ? 'Loading…' : '—';
  const trackedValue = stats ? formatNumber(stats.totalNEOs) : placeholder;
  const hazardousValue = stats ? formatNumber(stats.hazardousCount) : placeholder;
  const closestValue =
    stats?.closestApproachLD != null ? `${stats.closestApproachLD} LD` : placeholder;
  const communitySub =
    stats != null ? `${stats.socketCount} Online` : statsLoading ? 'Connecting…' : '—';

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-transparent text-white font-sans selection:bg-cyan-500/30">
      {/* 3D BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <CosmicSpaceScene />
      </div>

      {/* GRID OVERLAY */}
      <div
        className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
        aria-hidden
      />

      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-40 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-lg font-bold tracking-widest font-mono uppercase">
              Cosmic<span className="text-cyan-400">Watch</span>
            </span>
            <span className="hidden md:block px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-gray-400 border border-white/5">
              BETA v2.4
            </span>
          </div>

          <div className="flex gap-6 text-xs font-mono tracking-widest text-gray-400 uppercase">
            <div className="hidden md:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden />
              NASA Feed Active
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" aria-hidden />
              Risk Engine Idle
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-1.5 rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-mono transition-all uppercase tracking-wider"
          >
            <Terminal className="w-3 h-3" />
            System Login
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-30 flex flex-col items-center pt-32 md:pt-40 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center gap-3 px-3 py-1 rounded-full border border-white/10 bg-black/50 backdrop-blur-md"
        >
          <Globe className="w-3 h-3 text-cyan-400" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-200 uppercase">
            Global Near-Earth Object Monitoring
          </span>
        </motion.div>

        {/* MAIN TITLE - clipPath + sweep line like cosmic-watch */}
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 0.7, delay: 2.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 drop-shadow-2xl"
          >
            ORBITAL THREAT <br />
            INTELLIGENCE
          </motion.h1>
          <motion.div
            initial={{ top: 0, opacity: 0 }}
            animate={{ top: '100%', opacity: [0, 1, 0] }}
            transition={{ duration: 0.7, delay: 2.1 }}
            className="absolute left-0 w-full h-1 bg-green-400/50 shadow-[0_0_15px_rgba(0,255,0,0.8)] z-50"
          />
        </div>

        {/* SUBTITLE */}
        <div className="relative mt-6 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 0.6, delay: 2.8 }}
            className="text-sm md:text-base text-gray-400 font-mono leading-relaxed"
          >
            A full-stack platform transforming raw NASA NeoWs data into actionable
            insights. Track specific objects, calculate impact probabilities, and
            visualize cosmic threats in real-time.
          </motion.p>
        </div>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.5 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="group relative px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold tracking-widest uppercase rounded-sm overflow-hidden transition-all shadow-[0_0_20px_-5px_rgba(8,145,178,0.5)]"
          >
            <span className="relative z-10 flex items-center gap-2 justify-center">
              Launch Dashboard <ChevronRight className="w-4 h-4" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/documentation')}
            className="px-8 py-3 border border-white/20 bg-black/30 hover:bg-white/5 backdrop-blur-md text-sm font-mono tracking-widest uppercase rounded-sm transition-all text-gray-300 hover:text-white"
          >
            View Documentation
          </button>
        </motion.div>
      </section>

      {/* DATA CARDS - same as cosmic-watch with extra ping on COMMUNITY UPLINK */}
      <section className="absolute bottom-20 w-full z-30 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          <InfoCard
            label="TRACKED OBJECTS"
            value={trackedValue}
            sub="Active NEOs"
            icon={<Radar className="w-4 h-4 text-cyan-400" />}
            delay={3.6}
          />
          <InfoCard
            label="HAZARDOUS BODIES"
            value={hazardousValue}
            sub="Next 7 days"
            icon={<ShieldAlert className="w-4 h-4 text-red-400" />}
            delay={3.7}
          />
          <InfoCard
            label="CLOSEST APPROACH"
            value={closestValue}
            sub="Lunar Distance"
            icon={<Globe className="w-4 h-4 text-purple-400" />}
            delay={3.8}
          />
          <InfoCard
            label="COMMUNITY UPLINK"
            value="LIVE"
            sub={communitySub}
            icon={<MessageSquareDiff className="w-4 h-4 text-green-400" />}
            delay={3.9}
            extra={
              <div className="relative flex h-3 w-3 ml-3 mt-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              </div>
            }
          />
        </div>
      </section>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 w-full border-t border-white/10 bg-black/80 backdrop-blur-xl py-1.5 px-6 flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase tracking-widest z-50">
        <div className="flex gap-8">
          <span>
            Connection: <span className="text-green-500">SECURE (TLS 1.3)</span>
          </span>
          <span className="hidden md:inline">Server Load: 12%</span>
          <span className="hidden md:inline">API Latency: 42ms</span>
        </div>
        <div>AUTHORIZED PERSONNEL ONLY // ID: GUEST_USER</div>
      </div>
    </main>
  );
};

export default LandingPage;
