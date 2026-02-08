import { AsteroidGroup } from '@/types/asteroid';
import { motion } from 'framer-motion';

interface MonthSelectorProps {
  groups: AsteroidGroup[];
  selectedMonth: string | null;
  onSelectMonth: (month: string) => void;
}

export const MonthSelector = ({ groups, selectedMonth, onSelectMonth }: MonthSelectorProps) => {
  return (
    <div className="space-y-3">
      {groups.map((group, index) => (
        <motion.button
          key={`${group.month}-${group.year}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMonth(`${group.month} ${group.year}`)}
          className={`w-full text-left p-3 border rounded-sm transition-all font-mono text-xs uppercase tracking-wider ${
            selectedMonth === `${group.month} ${group.year}`
              ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
              : 'border-white/10 text-gray-400 hover:border-cyan-500/50 hover:text-white'
          }`}
        >
          {group.month.toUpperCase()} {group.year} ASTEROIDS
        </motion.button>
      ))}
    </div>
  );
};
