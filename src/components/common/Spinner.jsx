import React from 'react';
import { motion } from 'framer-motion';

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <motion.div
      className={`rounded-full border-2 border-primary-200 dark:border-primary-900 border-t-primary-600 ${sizes[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}
