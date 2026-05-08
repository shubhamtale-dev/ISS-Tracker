import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorCard({ message, onRetry, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-6 flex flex-col items-center gap-3 text-center ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-rose-500" />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary text-xs px-3 py-1.5">
          <RefreshCw className="w-3 h-3" />
          Retry
        </button>
      )}
    </motion.div>
  );
}
