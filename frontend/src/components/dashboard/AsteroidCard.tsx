import { Asteroid } from '@/types/asteroid';
import { motion } from 'framer-motion';
import { Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LUNAR_DISTANCE_KM = 384400;

function formatCloseApproachDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function riskScoreNumber(risk: 'low' | 'medium' | 'high'): number {
  return risk === 'high' ? 75 : risk === 'medium' ? 45 : 22;
}

interface AsteroidCardProps {
  asteroid: Asteroid;
  isWatched: boolean;
  onToggleWatch: () => void;
  onCardClick?: () => void;
}

export const AsteroidCard = ({ asteroid, isWatched, onToggleWatch, onCardClick }: AsteroidCardProps) => {
  const diameterKm = (asteroid.diameterMin + asteroid.diameterMax) / 2 / 1000;
  const lunarDist = asteroid.missDistanceKm / LUNAR_DISTANCE_KM;
  const missMillions = asteroid.missDistanceKm / 1e6;
  const score = riskScoreNumber(asteroid.riskScore);

  const riskBadgeClass =
    asteroid.riskScore === 'high'
      ? 'bg-red-500/20 text-red-400 border-red-500/50'
      : asteroid.riskScore === 'medium'
        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
        : 'bg-green-500/20 text-green-400 border-green-500/50';

  const progressClass =
    asteroid.riskScore === 'high'
      ? 'bg-red-500'
      : asteroid.riskScore === 'medium'
        ? 'bg-amber-500'
        : 'bg-green-500';

  const borderAccent =
    asteroid.riskScore === 'high'
      ? 'border-l-red-500/50 border-t-red-500/50'
      : asteroid.riskScore === 'medium'
        ? 'border-l-amber-500/50 border-t-amber-500/50'
        : 'border-l-green-500/50 border-t-green-500/50';

  const nasaUrl = `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${encodeURIComponent(asteroid.nasaId || asteroid.name)}`;

  return (
    <motion.div
      layout
      role={onCardClick ? 'button' : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onKeyDown={onCardClick ? (e) => e.key === 'Enter' && onCardClick() : undefined}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onCardClick}
      className={`rounded-lg border border-white/10 bg-black/40 p-4 flex flex-col gap-3 border-l-4 border-t-4 ${borderAccent} font-['Arial'] ${onCardClick ? 'cursor-pointer hover:border-white/20 transition-colors' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-white/95 text-sm md:text-base truncate tracking-tight">{asteroid.name}</p>
          <p className="text-xs text-gray-500">ID: {asteroid.nasaId || asteroid.id}</p>
        </div>
        <span
          className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${riskBadgeClass}`}
        >
          {asteroid.riskScore}
        </span>
      </div>

      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Risk Score</p>
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${progressClass}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className={`text-xs font-bold shrink-0 ${asteroid.riskScore === 'high' ? 'text-red-400' : asteroid.riskScore === 'medium' ? 'text-amber-400' : 'text-green-400'}`}>
            {score}/100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div>
          <span className="text-gray-500">Diameter:</span>
          <span className="ml-1 text-white">{diameterKm.toFixed(2)} km</span>
        </div>
        <div>
          <span className="text-gray-500">Velocity:</span>
          <span className="ml-1 text-white">{asteroid.velocity.toLocaleString(undefined, { maximumFractionDigits: 0 })} km/h</span>
        </div>
        <div>
          <span className="text-gray-500">Miss Distance:</span>
          <span className="ml-1 text-white">{missMillions.toFixed(2)} million km</span>
        </div>
        <div>
          <span className="text-gray-500">Lunar Dist.:</span>
          <span className="ml-1 text-white">{lunarDist.toFixed(2)} LD</span>
        </div>
      </div>

      <div className="bg-black/30 rounded px-2 py-1.5">
        <p className="text-[10px] text-gray-500 uppercase">Close Approach Date</p>
        <p className="text-sm text-white">{formatCloseApproachDate(asteroid.closeApproachDate)}</p>
      </div>

      <div className="flex gap-1.5 mt-auto pt-2 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleWatch}
          className={`flex-1 min-w-0 text-[10px] uppercase h-8 border font-['Arial'] ${
            isWatched ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10' : 'border-white/20 text-gray-400 hover:border-cyan-500/50'
          }`}
        >
          <Star className={`w-3 h-3 mr-1 shrink-0 ${isWatched ? 'fill-cyan-400' : ''}`} />
          <span className="truncate">{isWatched ? 'In Watchlist' : 'Add to Watchlist'}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 w-8 p-0 shrink-0 border border-white/20 text-gray-400 hover:border-cyan-500/50 font-['Arial']"
          title="View on NASA"
        >
          <a href={nasaUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </motion.div>
  );
};
