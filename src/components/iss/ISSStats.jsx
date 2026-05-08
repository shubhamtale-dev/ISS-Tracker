import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, Navigation, Hash, RefreshCw, Clock } from 'lucide-react';
import { useISS } from '../../context/ISSContext';
import Spinner from '../common/Spinner';

function StatTile({ icon: Icon, label, value, color = 'blue', delay = 0 }) {
  const colors = {
    blue:    'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    violet:  'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    amber:   'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="stat-card group hover:shadow-lg transition-shadow duration-200"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono leading-tight mt-0.5">
          {value ?? <span className="skeleton inline-block w-20 h-5 rounded" />}
        </p>
      </div>
    </motion.div>
  );
}

export default function ISSStats() {
  const { position, positions, speed, lastUpdated, loading, error, manualRefresh } = useISS();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="section-title">Live ISS Position</h3>
          {lastUpdated && (
            <p className="section-subtitle flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={manualRefresh}
          disabled={loading}
          className="btn-secondary"
          aria-label="Refresh ISS position"
        >
          {loading ? <Spinner size="sm" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      {error && (
        <div className="card p-4 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20">
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile
          icon={MapPin}
          label="Latitude"
          value={position ? `${position.lat.toFixed(4)}°` : null}
          color="blue"
          delay={0}
        />
        <StatTile
          icon={Navigation}
          label="Longitude"
          value={position ? `${position.lon.toFixed(4)}°` : null}
          color="violet"
          delay={0.05}
        />
        <StatTile
          icon={Zap}
          label="Speed (km/h)"
          value={speed ? Math.round(speed).toLocaleString() : '—'}
          color="emerald"
          delay={0.1}
        />
        <StatTile
          icon={Hash}
          label="Positions Tracked"
          value={positions.length}
          color="amber"
          delay={0.15}
        />
      </div>
    </div>
  );
}
