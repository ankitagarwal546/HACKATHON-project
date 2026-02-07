import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { SpaceBackground } from '@/components/3d/SpaceBackground';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen overflow-hidden">
      {/* 3D Space Background with Earth and Asteroids */}
      <SpaceBackground />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 pointer-events-none" />

      {/* Scanline effect */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Navigation */}
      <Navbar />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Glowing accent above title */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-[2px] bg-primary mx-auto mb-8 glow-pulse"
          />

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-bold tracking-wider mb-6 text-foreground drop-shadow-[0_0_30px_rgba(0,212,255,0.3)]">
            ASTEROID TRACKER
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-foreground/80 font-rajdhani font-light tracking-wide mb-12 max-w-2xl mx-auto"
          >
            From here, you can monitor Near Earth Object trajectories, properties
            and close approaches
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="relative px-12 py-4 font-orbitron text-lg tracking-widest border-2 border-foreground/60 text-foreground bg-background/30 backdrop-blur-sm hover:border-primary hover:text-primary hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300 pointer-events-auto"
          >
            GO TRACK
            <span className="absolute inset-0 bg-primary/5 opacity-0 hover:opacity-100 transition-opacity" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
