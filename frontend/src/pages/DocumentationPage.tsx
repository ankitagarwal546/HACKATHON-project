import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Database,
  ShieldAlert,
  UserCheck,
  Terminal,
  ArrowLeft,
  Activity,
  Globe,
  Box,
  Github,
  ExternalLink,
  Wifi,
  Cpu,
  MessageSquare,
  Layers,
} from 'lucide-react';

const DocSection = ({
  title,
  icon: Icon,
  children,
  delay,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  delay: number;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    whileHover={{
      scale: 1.02,
      y: -5,
      borderColor: 'rgba(34, 211, 238, 0.6)',
      boxShadow: '0px 10px 30px -5px rgba(34, 211, 238, 0.3)',
    }}
    className="group relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md transition-all"
  >
    <div className="absolute inset-0 z-0 bg-blue-500/5 group-hover:bg-cyan-500/5 transition-colors duration-500" />
    <div className="relative z-10">
      <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-3">
        <div className="rounded-lg bg-blue-900/30 p-2 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-300 group-hover:text-cyan-300 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]">
          <Icon size={20} />
        </div>
        <h2 className="font-orbitron text-xl font-bold tracking-widest text-white transition-colors group-hover:text-cyan-100">
          {title.toUpperCase()}
        </h2>
      </div>
      <div className="text-gray-300 leading-relaxed font-sans group-hover:text-gray-100 transition-colors">
        {children}
      </div>
    </div>
  </motion.section>
);

export default function DocumentationPage() {
  const navigate = useNavigate();
  const [stars, setStars] = useState<
    { id: number; top: number; left: number; size: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    const starArray = Array.from({ length: 200 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
    setStars(starArray);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030308] text-white">
      {/* Background layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
        <motion.div
          className="absolute h-[2px] w-[150px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.8)]"
          initial={{ top: '10%', left: '100%', opacity: 0 }}
          animate={{ top: '50%', left: '-20%', opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 7, ease: 'linear' }}
          style={{ rotate: -35 }}
        />
        <motion.div
          className="absolute h-[2px] w-[100px] bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.8)]"
          initial={{ top: '30%', left: '110%', opacity: 0 }}
          animate={{ top: '80%', left: '-10%', opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 12, delay: 2, ease: 'linear' }}
          style={{ rotate: -45 }}
        />
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      </div>

      {/* Back button */}
      <div className="fixed top-8 left-8 z-50">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-black/60 text-sm font-medium hover:bg-white/10 hover:border-cyan-400 hover:text-cyan-300 transition-all backdrop-blur-md group shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-orbitron">RETURN TO MISSION CONTROL</span>
        </button>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <div className="inline-block mb-8 rounded border border-cyan-500/30 bg-cyan-950/30 px-4 py-1 text-xs font-mono tracking-[0.3em] text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.2)]">
            SYSTEM MANUAL V2.1
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <Activity
              size={64}
              strokeWidth={2.5}
              className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"
            />
            <h1 className="font-orbitron text-6xl md:text-7xl font-black tracking-tighter">
              <span className="text-white drop-shadow-xl">COSMIC</span>
              <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">WATCH</span>
            </h1>
          </div>
          <p className="text-xl font-light tracking-[0.5em] text-cyan-200/60 font-sans mt-2">
            SATELLITE MONITORING SYSTEM
          </p>
        </motion.div>

        <div className="grid gap-8">
          <DocSection title="Mission Brief" icon={BookOpen} delay={0.1}>
            <p>
              In the vastness of space, thousands of Near-Earth Objects (NEOs) pass by our planet daily.
              Cosmic Watch is a full-stack platform designed to translate complex trajectory data from NASA
              into understandable risk assessments and visual alerts. We foster scientific curiosity and global
              safety awareness through accessible technology.
            </p>
          </DocSection>

          <DocSection title="Deep Space Telemetry" icon={Database} delay={0.2}>
            <p>
              Real-time orbital data is ingested via secure uplink from the{' '}
              <span className="text-cyan-300 font-bold">NASA NeoWs API</span>. The system processes raw JSON
              feeds to extract critical flight telemetry:
            </p>
            <div className="mt-3 flex gap-2 overflow-x-auto text-xs font-mono">
              <span className="bg-white/10 px-2 py-1 rounded text-cyan-200">VELOCITY_KM_H</span>
              <span className="bg-white/10 px-2 py-1 rounded text-cyan-200">MISS_DISTANCE_AU</span>
              <span className="bg-white/10 px-2 py-1 rounded text-cyan-200">ORBITAL_ID</span>
            </div>
          </DocSection>

          <DocSection title="Risk Analysis Engine" icon={ShieldAlert} delay={0.3}>
            <p className="mb-4">
              Our proprietary engine categorizes objects based on kinetic threat vectors. The risk score is
              calculated using the following parameters:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-mono">
              {[
                { label: 'Est. Diameter > 140m', color: 'bg-red-500 shadow-red-500/50' },
                { label: 'High Velocity Vector', color: 'bg-orange-500 shadow-orange-500/50' },
                { label: 'Close Approach (< 5LD)', color: 'bg-yellow-500 shadow-yellow-500/50' },
                { label: 'Hazard Classification', color: 'bg-purple-500 shadow-purple-500/50' },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 bg-black/40 p-2 rounded border border-white/5 text-cyan-100/80"
                >
                  <span className={`h-2 w-2 rounded-full shadow-[0_0_8px] ${item.color}`} />
                  {item.label}
                </li>
              ))}
            </ul>
          </DocSection>

          <DocSection title="3D Orbital Visualization" icon={Globe} delay={0.35}>
            <p className="mb-4">
              The platform features an interactive 3D rendering module (powered by Three.js). This allows
              operators to visualize the asteroid&apos;s orbit relative to Earth in a simulated physics environment,
              providing spatial context to the raw data.
            </p>
          </DocSection>

          <DocSection title="Containerized Architecture" icon={Box} delay={0.4}>
            <p className="mb-3">
              Cosmic Watch follows a microservices-ready architecture, fully containerized for rapid deployment.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-400">
              <div className="p-3 border border-white/10 rounded bg-white/5 flex items-center gap-2">
                <Layers size={14} className="text-cyan-400" />
                <span>Docker Compose Orch.</span>
              </div>
              <div className="p-3 border border-white/10 rounded bg-white/5 flex items-center gap-2">
                <Terminal size={14} className="text-cyan-400" />
                <span>RESTful API Endpoints</span>
              </div>
              <div className="p-3 border border-white/10 rounded bg-white/5 flex items-center gap-2">
                <Cpu size={14} className="text-cyan-400" />
                <span>React/Vite Frontend</span>
              </div>
              <div className="p-3 border border-white/10 rounded bg-white/5 flex items-center gap-2">
                <Database size={14} className="text-cyan-400" />
                <span>MongoDB</span>
              </div>
            </div>
          </DocSection>

          <DocSection title="Secure Ops & Uplink" icon={UserCheck} delay={0.5}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded bg-blue-950/20 border border-blue-800/30">
                <div className="flex items-center gap-2 text-cyan-300 text-sm mb-2 font-bold">
                  <UserCheck size={16} /> USER AUTHENTICATION
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Secure login for researchers to save &quot;watched&quot; asteroids. Passwords are hashed and
                  sessions secured via JWT.
                </p>
              </div>
              <div className="p-4 rounded bg-blue-950/20 border border-blue-800/30">
                <div className="flex items-center gap-2 text-cyan-300 text-sm mb-2 font-bold">
                  <MessageSquare size={16} /> COMMUNITY UPLINK
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Real-time community thread for discussing specific asteroids. Automated scheduling
                  notifies users of upcoming close approaches.
                </p>
              </div>
            </div>
          </DocSection>
        </div>
      </div>

      <footer className="relative z-10 w-full border-t border-white/10 bg-[#050510] py-12 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Activity className="text-cyan-400" size={28} />
                <h3 className="font-orbitron text-xl font-bold tracking-widest">
                  <span className="text-white">COSMIC</span>
                  <span className="text-cyan-400">WATCH</span>
                </h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                A full-stack NEO monitoring platform transforming NASA datasets into actionable planetary
                defense insights.
              </p>
              <div className="flex gap-4 mt-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-mono text-green-400">SYSTEM NOMINAL</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:items-center">
              <h3 className="font-mono text-sm text-cyan-300">MISSION LINKS</h3>
              <ul className="flex flex-col gap-2 text-sm text-gray-400 md:text-center">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Mission Control
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 hover:text-white transition-colors justify-start md:justify-center"
                  >
                    <Github size={14} /> Repository
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 hover:text-white transition-colors justify-start md:justify-center"
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4 md:items-end">
              <h3 className="font-mono text-sm text-cyan-300">TELEMETRY STATUS</h3>
              <ul className="flex flex-col gap-2 text-xs font-mono text-gray-500 md:text-right">
                <li className="flex items-center gap-2 justify-start md:justify-end">
                  <span>NASA_UPLINK</span>
                  <Wifi size={12} className="text-green-500" />
                </li>
                <li>LATENCY: 42ms</li>
                <li>ENCRYPTION: AES-256</li>
                <li>BUILD: 2026.02.07.ALPHA</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8 text-xs text-gray-600">
            <p className="font-mono">© 2026 COSMIC WATCH INITIATIVE. ALL RIGHTS RESERVED.</p>
            <p className="font-mono mt-2 md:mt-0">HACKATHON SUBMISSION ID: OX-994</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
