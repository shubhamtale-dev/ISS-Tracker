import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, AlertCircle, SearchX, RefreshCw } from 'lucide-react';
import NewsFilters from '../components/news/NewsFilters';
import NewsCard, { NewsCardSkeleton } from '../components/news/NewsCard';
import { useNews } from '../context/NewsContext';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function NewsPage() {
  const { filtered, loading, error, search, refresh, lastUpdated } = useNews();

  return (
    <motion.div
      className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-glow-violet">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              News Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {loading
                ? 'Fetching latest articles…'
                : `${filtered.length} articles · Cached 15 min`}
            </p>
          </div>
        </div>

        {lastUpdated && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <RefreshCw className="w-3.5 h-3.5" />
            Updated {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </motion.div>

      {/* Error banner */}
      {error && (
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
        >
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-600 dark:text-amber-400">{error}</p>
        </motion.div>
      )}

      {/* Filters */}
      <motion.section variants={itemVariants}>
        <NewsFilters />
      </motion.section>

      {/* Article grid */}
      <motion.section variants={itemVariants}>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState search={search} onRefresh={refresh} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((article, index) => (
              <NewsCard key={article.url || index} article={article} index={index} />
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}

function EmptyState({ search, onRefresh }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-dark-800 flex items-center justify-center">
        <SearchX className="w-8 h-8 text-slate-400" />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
          {search ? `No results for "${search}"` : 'No articles found'}
        </p>
        <p className="text-sm text-slate-400 mt-1">
          {search ? 'Try a different search term or clear the filter.' : 'Try refreshing the news feed.'}
        </p>
      </div>
      {!search && (
        <button onClick={onRefresh} className="btn-primary mt-2">
          <RefreshCw className="w-4 h-4" />
          Refresh News
        </button>
      )}
    </div>
  );
}
