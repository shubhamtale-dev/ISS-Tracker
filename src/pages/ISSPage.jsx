import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, Globe2, AlertCircle } from 'lucide-react';
import ISSStats from '../components/iss/ISSStats';
import ISSMap from '../components/iss/ISSMap';
import AstronautPanel from '../components/iss/AstronautPanel';
import SpeedChart from '../components/charts/SpeedChart';
import { useISS } from '../context/ISSContext';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function ISSPage() {
  const { loading, error } = useISS();

  return (
    <motion.div
      className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow-blue">
          <Satellite className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
            ISS Live Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Globe2 className="w-3.5 h-3.5" />
            Real-time position updated every 15 seconds
          </p>
        </div>
      </motion.div>

      {/* Global error banner */}
      {error && (
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800"
        >
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        </motion.div>
      )}

      {/* Stats row */}
      <motion.section variants={itemVariants}>
        <ISSStats />
      </motion.section>

      {/* Map + Astronauts */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        {/* Map — takes 2/3 width on large screens */}
        <div className="xl:col-span-2 flex flex-col gap-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="live-dot" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Live World Map
            </span>
          </div>
          <ISSMap />
        </div>

        {/* Astronaut panel — 1/3 width */}
        <div className="flex flex-col gap-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Crew in Orbit
            </span>
          </div>
          <div className="flex-1">
            <AstronautPanel />
          </div>
        </div>
      </motion.div>

      {/* Speed chart */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Speed Telemetry
          </span>
        </div>
        <SpeedChart />
      </motion.section>

      {/* Orbital facts footer */}
      <motion.section variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Orbital Altitude', value: '~408 km', color: 'text-primary-500' },
            { label: 'Orbital Period', value: '~92 min', color: 'text-violet-500' },
            { label: 'Orbits per Day', value: '~15.5', color: 'text-emerald-500' },
            { label: 'Crew Capacity', value: '7 people', color: 'text-amber-500' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="card p-4 text-center hover:shadow-lg transition-shadow duration-200"
            >
              <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
