import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import heroBg from '@/assets/hero-bg.jpg';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image - Fixed to fit frame */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat md:bg-cover"
          style={{ 
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/90" />
      </motion.div>

      {/* Scanline effect */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Navigation */}
      <Navbar />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
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

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-bold tracking-wider mb-6 text-foreground">
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
            className="relative px-12 py-4 font-orbitron text-lg tracking-widest border-2 border-foreground/60 text-foreground bg-transparent hover:border-primary hover:text-primary transition-all duration-300 glow-pulse"
          >
            GO TRACK
            <span className="absolute inset-0 bg-primary/5 opacity-0 hover:opacity-100 transition-opacity" />
          </motion.button>
        </motion.div>

      </div>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent to-background">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-orbitron text-center mb-16 text-gradient"
          >
            MONITOR THE COSMOS
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-Time Tracking',
                description: 'Live data from NASA NeoWs API showing current asteroid positions, velocities, and trajectories.',
                icon: '🛰️',
              },
              {
                title: 'Risk Analysis',
                description: 'Comprehensive hazard assessment categorizing asteroids by potential impact threat levels.',
                icon: '⚠️',
              },
              {
                title: '3D Visualization',
                description: 'Interactive solar system model showing asteroid orbits relative to Earth.',
                icon: '🌍',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-card/50 backdrop-blur-sm border border-border rounded-lg hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-orbitron text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-rajdhani">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
