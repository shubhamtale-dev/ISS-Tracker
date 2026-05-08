import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2, TrendingUp, Satellite, Newspaper,
  Users, Zap, Globe2, Clock,
} from 'lucide-react';
import SpeedChart from '../components/charts/SpeedChart';
import NewsDistributionChart from '../components/charts/NewsDistributionChart';
import { useISS } from '../context/ISSContext';
import { useNews } from '../context/NewsContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const BAR_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'];

function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-primary-400">{payload[0].value} articles</p>
    </div>
  );
}

export default function ChartsPage() {
  const { speed, speedHistory, astronauts, positions, loading: issLoading } = useISS();
  const { articles, loading: newsLoading } = useNews();

  // Articles published by hour-of-day
  const hourlyData = useMemo(() => {
    const counts = Array.from({ length: 24 }, (_, h) => ({ hour: `${h}:00`, count: 0 }));
    articles.forEach(a => {
      if (a.publishedAt) {
        const h = new Date(a.publishedAt).getHours();
        counts[h].count += 1;
      }
    });
    // Only return non-zero hours for readability, or all if all zero
    const nonZero = counts.filter(c => c.count > 0);
    return nonZero.length > 0 ? nonZero : counts.slice(6, 22);
  }, [articles]);

  const avgSpeed = useMemo(() => {
    if (!speedHistory.length) return null;
    return Math.round(speedHistory.reduce((s, d) => s + d.speed, 0) / speedHistory.length);
  }, [speedHistory]);

  const topSources = useMemo(() => {
    const counts = {};
    articles.forEach(a => {
      const src = a.source?.name || 'Unknown';
      counts[src] = (counts[src] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [articles]);

  const kpiCards = [
    {
      icon: Satellite,
      label: 'Positions Tracked',
      value: positions.length,
      sub: 'Since session start',
      color: 'blue',
    },
    {
      icon: Zap,
      label: 'Avg ISS Speed',
      value: avgSpeed ? `${avgSpeed.toLocaleString()} km/h` : '—',
      sub: `${speedHistory.length} samples`,
      color: 'emerald',
    },
    {
      icon: Users,
      label: 'People in Orbit',
      value: astronauts.length,
      sub: 'Currently in space',
      color: 'violet',
    },
    {
      icon: Newspaper,
      label: 'News Articles',
      value: articles.length,
      sub: 'Loaded this session',
      color: 'amber',
    },
  ];

  const colorMap = {
    blue: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    violet: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  };

  return (
    <motion.div
      className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-glow-emerald">
          <BarChart2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
            Analytics & Charts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time data visualizations for ISS telemetry and news insights
          </p>
        </div>
      </motion.div>

      {/* KPI cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {kpiCards.map(({ icon: Icon, label, value, sub, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            className="card p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow duration-200"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{label}</p>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                {value}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ISS Speed Chart */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            ISS Speed Telemetry
          </span>
        </div>
        <SpeedChart />
      </motion.section>

      {/* News charts row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 xl:grid-cols-2 gap-6"
      >
        {/* Pie chart */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe2 className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              News by Source
            </span>
          </div>
          <NewsDistributionChart />
        </div>

        {/* Bar chart — articles by hour */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Articles by Hour Published
            </span>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Publication Timeline
                </h3>
                <p className="text-xs text-slate-400">Hour of day (UTC)</p>
              </div>
            </div>
            {newsLoading ? (
              <div className="h-52 flex items-center justify-center">
                <div className="skeleton h-full w-full rounded-xl" />
              </div>
            ) : (
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {hourlyData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={BAR_COLORS[index % BAR_COLORS.length]}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Top sources leaderboard */}
      {topSources.length > 0 && (
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Top News Sources
            </span>
          </div>
          <div className="card p-5 space-y-3">
            {topSources.map(({ name, value }, i) => {
              const max = topSources[0]?.value || 1;
              const pct = Math.round((value / max) * 100);
              return (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-4 text-right">{i + 1}</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300 w-32 truncate font-medium">
                    {name}
                  </span>
                  <div className="flex-1 bg-slate-100 dark:bg-dark-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: BAR_COLORS[i % BAR_COLORS.length] }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-16 text-right">
                    {value} article{value !== 1 ? 's' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
