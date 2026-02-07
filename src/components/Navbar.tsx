import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'HOME', path: '/' },
  { label: 'NEO TRACKER', path: '/dashboard' },
  { label: '3D EXPLORER', path: '/explorer' },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/30 backdrop-blur-md border-b border-border/30"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-center gap-8 md:gap-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-orbitron text-sm md:text-base tracking-widest transition-all duration-300 hover:text-primary ${
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-foreground/80'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};
