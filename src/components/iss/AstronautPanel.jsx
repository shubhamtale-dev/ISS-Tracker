import React from 'react';
import { motion } from 'framer-motion';
import { Users, User } from 'lucide-react';
import { useISS } from '../../context/ISSContext';

const CRAFT_COLORS = {
  ISS:    'badge-blue',
  Shenzhou: 'badge-rose',
  Tiangong: 'badge-rose',
};

export default function AstronautPanel() {
  const { astronauts, loading } = useISS();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card p-5 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
          <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">People in Space</h3>
          {!loading && (
            <p className="text-xs text-slate-400">
              {astronauts.length} astronaut{astronauts.length !== 1 ? 's' : ''} currently in orbit
            </p>
          )}
        </div>
        {!loading && (
          <span className="ml-auto badge badge-blue text-base font-bold px-3 py-1">
            {astronauts.length}
          </span>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl">
                <div className="skeleton w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-3 w-3/4 rounded" />
                  <div className="skeleton h-2.5 w-1/3 rounded" />
                </div>
              </div>
            ))
          : astronauts.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{a.name}</p>
                  <span className={`text-xs ${CRAFT_COLORS[a.craft] || 'badge-blue'} badge mt-0.5`}>
                    {a.craft}
                  </span>
                </div>
              </motion.div>
            ))
        }
      </div>
    </motion.div>
  );
}
