import React from 'react';
import { Search, ArrowUpDown, RefreshCw, SortAsc } from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import Spinner from '../common/Spinner';

export default function NewsFilters() {
  const { search, setSearch, sortBy, setSortBy, refresh, loading, lastUpdated } = useNews();

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="news-search"
            type="text"
            placeholder="Search articles, sources…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>

        {/* Sort by Date */}
        <button
          id="sort-date-btn"
          onClick={() => setSortBy('date')}
          className={`btn-secondary gap-2 whitespace-nowrap ${sortBy === 'date' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-primary-300 dark:border-primary-700' : ''}`}
        >
          <ArrowUpDown className="w-4 h-4" />
          Sort by Date
        </button>

        {/* Sort by Source */}
        <button
          id="sort-source-btn"
          onClick={() => setSortBy('source')}
          className={`btn-secondary gap-2 whitespace-nowrap ${sortBy === 'source' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-primary-300 dark:border-primary-700' : ''}`}
        >
          <SortAsc className="w-4 h-4" />
          Sort by Source
        </button>

        {/* Refresh */}
        <button
          id="news-refresh-btn"
          onClick={refresh}
          disabled={loading}
          className="btn-primary whitespace-nowrap"
        >
          {loading ? <Spinner size="sm" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      {lastUpdated && (
        <p className="text-xs text-slate-400 mt-2">
          Cached until {new Date(lastUpdated.getTime() + 15 * 60000).toLocaleTimeString()} · {' '}
          Showing results for: <strong className="text-slate-600 dark:text-slate-300">{sortBy === 'date' ? 'Newest First' : 'By Source'}</strong>
        </p>
      )}
    </div>
  );
}
