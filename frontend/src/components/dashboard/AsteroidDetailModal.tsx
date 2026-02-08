import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gauge, Ruler, Target, Calendar, AlertTriangle } from 'lucide-react';
import { apiRequest } from '@/lib/apiClient';
import type { BackendAsteroid } from '@/lib/apiClient';
import { mapBackendAsteroidToFrontend } from '@/lib/mapBackendAsteroid';
import type { Asteroid } from '@/types/asteroid';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const LUNAR_KM = 384400;

interface AsteroidDetailModalProps {
  asteroidId: string | null;
  initialAsteroid?: Asteroid | null;
  onClose: () => void;
}

interface ChartPoint {
  date: string;
  velocity: number;
  missDistance: number;
  year: string;
}

function buildChartData(approachData: BackendAsteroid['close_approach_data']): ChartPoint[] {
  if (!approachData || !Array.isArray(approachData)) return [];
  return approachData
    .slice(0, 30)
    .map((a) => {
      const vel = a?.relative_velocity?.kilometers_per_hour;
      const km = a?.miss_distance?.kilometers;
      const velocity = typeof vel === 'string' ? parseFloat(vel) || 0 : Number(vel) || 0;
      const missDistance = typeof km === 'string' ? parseFloat(km) || 0 : Number(km) || 0;
      const date = a?.close_approach_date || '';
      return {
        date,
        year: date ? new Date(date).getFullYear().toString() : '',
        velocity: Math.round(velocity),
        missDistance: Math.round(missDistance / 1e6 * 100) / 100,
      };
    })
    .filter((p) => p.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function AsteroidDetailModal({ asteroidId, initialAsteroid, onClose }: AsteroidDetailModalProps) {
  const [raw, setRaw] = useState<BackendAsteroid | null>(null);
  const [loading, setLoading] = useState(!!asteroidId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!asteroidId) {
      setRaw(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    apiRequest<{ success: boolean; asteroid?: BackendAsteroid }>(
      `/api/lookup/${encodeURIComponent(asteroidId)}`
    )
      .then((data) => {
        if (data?.asteroid) {
          setRaw(data.asteroid);
        } else {
          setError('Asteroid not found');
        }
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load');
        setRaw(null);
      })
      .finally(() => setLoading(false));
  }, [asteroidId]);

  const asteroid: Asteroid | null = raw ? mapBackendAsteroidToFrontend(raw) : initialAsteroid || null;
  const chartData = raw ? buildChartData(raw.close_approach_data) : [];

  if (!asteroidId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      >
        {/* Opaque background with moving stars */}
        <div className="absolute inset-0 bg-[#030712]" aria-hidden />
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          {[...Array(120)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/70"
              style={{
                left: `${(i * 7 + 3) % 100}%`,
                top: `${(i * 11 + 5) % 100}%`,
                width: i % 4 === 0 ? 2 : 1,
                height: i % 4 === 0 ? 2 : 1,
                animation: `starDrift ${15 + (i % 10)}s linear infinite`,
                animationDelay: `${(i * 2) % 15}s`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes starDrift {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-120vw, -80vh); }
          }
        `}</style>

        <div className="relative flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
          <h2 className="text-lg font-semibold text-white font-['Arial'] truncate">
            {asteroid?.name || (loading ? 'Loading…' : 'Asteroid details')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading && !asteroid && (
          <div className="flex-1 flex items-center justify-center text-gray-400 font-['Arial']">
            Loading asteroid data…
          </div>
        )}

        {error && !asteroid && (
          <div className="flex-1 flex items-center justify-center text-red-400 font-['Arial']">
            {error}
          </div>
        )}

        {asteroid && (
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
            {/* Left: chart - black & grey */}
            <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col border-r border-white/10 bg-zinc-950/80 p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2 font-['Arial'] uppercase tracking-wider">
                Speed & miss distance over close approaches
              </h3>
              <div className="flex-1 min-h-[280px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="year"
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        tickLine={{ stroke: '#4b5563' }}
                      />
                      <YAxis
                        yAxisId="velocity"
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        tickLine={{ stroke: '#4b5563' }}
                        label={{ value: 'Velocity (km/h)', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 11 }}
                      />
                      <YAxis
                        yAxisId="miss"
                        orientation="right"
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 11 }}
                        tickLine={{ stroke: '#4b5563' }}
                        label={{ value: 'Miss (M km)', angle: 90, position: 'insideRight', fill: '#6b7280', fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
                        labelStyle={{ color: '#d1d5db' }}
                        labelFormatter={(_, payload) => payload[0]?.payload?.date || ''}
                        formatter={(value: number, name: string) => [
                          name === 'velocity' ? `${value.toLocaleString()} km/h` : `${value} M km`,
                          name === 'velocity' ? 'Velocity' : 'Miss distance',
                        ]}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line
                        yAxisId="velocity"
                        type="monotone"
                        dataKey="velocity"
                        name="Velocity (km/h)"
                        stroke="#a1a1aa"
                        strokeWidth={2}
                        dot={{ fill: '#3f3f46', stroke: '#71717a' }}
                        connectNulls
                      />
                      <Line
                        yAxisId="miss"
                        type="monotone"
                        dataKey="missDistance"
                        name="Miss distance (M km)"
                        stroke="#52525b"
                        strokeWidth={2}
                        dot={{ fill: '#27272a', stroke: '#52525b' }}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 font-['Arial'] text-sm">
                    No close-approach history for chart
                  </div>
                )}
              </div>
            </div>

            {/* Right: detailed data */}
            <div className="w-full lg:w-1/2 xl:w-3/5 overflow-y-auto p-6 bg-black/30">
              <div className="grid gap-4 font-['Arial']">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Risk level</p>
                    <p className="text-white font-medium capitalize">{asteroid.riskScore}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Ruler className="w-4 h-4" />
                      <span className="text-xs uppercase">Diameter</span>
                    </div>
                    <p className="text-white">
                      {((asteroid.diameterMin + asteroid.diameterMax) / 2 / 1000).toFixed(3)} km
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      (min–max: {asteroid.diameterMin.toFixed(0)}–{asteroid.diameterMax.toFixed(0)} m)
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Gauge className="w-4 h-4" />
                      <span className="text-xs uppercase">Velocity</span>
                    </div>
                    <p className="text-white">
                      {asteroid.velocity.toLocaleString(undefined, { maximumFractionDigits: 0 })} km/h
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {asteroid.velocityKmps.toFixed(2)} km/s
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Target className="w-4 h-4" />
                      <span className="text-xs uppercase">Miss distance</span>
                    </div>
                    <p className="text-white">
                      {(asteroid.missDistanceKm / 1e6).toFixed(2)} million km
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {(asteroid.missDistanceKm / LUNAR_KM).toFixed(2)} lunar distances
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs uppercase">Close approach</span>
                    </div>
                    <p className="text-white">
                      {asteroid.closeApproachDate
                        ? new Date(asteroid.closeApproachDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : '—'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Orbiting body: {asteroid.orbitingBody}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-500 uppercase mb-1">NASA ID / Reference</p>
                  <p className="text-white font-mono">{asteroid.nasaId || asteroid.id}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-500 uppercase mb-1">Potentially hazardous</p>
                  <p className={asteroid.isHazardous ? 'text-amber-400' : 'text-gray-400'}>
                    {asteroid.isHazardous ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-500 uppercase mb-1">Absolute magnitude (H)</p>
                  <p className="text-white">{asteroid.absoluteMagnitude}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
