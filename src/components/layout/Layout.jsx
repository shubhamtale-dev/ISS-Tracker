import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Satellite, Newspaper, BarChart2, Menu, X, Moon, Sun, Rocket } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ISSPage from '../../pages/ISSPage';
import NewsPage from '../../pages/NewsPage';
import ChartsPage from '../../pages/ChartsPage';

const NAV_ITEMS = [
  { id: 'iss',    label: 'ISS Tracker',      icon: Satellite },
  { id: 'news',   label: 'News Dashboard',   icon: Newspaper },
  { id: 'charts', label: 'Charts',           icon: BarChart2 },
];

export default function Layout() {
  const [activePage, setActivePage] = useState('iss');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const renderPage = () => {
    switch (activePage) {
      case 'iss':    return <ISSPage />;
      case 'news':   return <NewsPage />;
      case 'charts': return <ChartsPage />;
      default:       return <ISSPage />;
    }
  };

  const handleNav = (id) => {
    setActivePage(id);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
      {/* ── Overlay for mobile ── */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <AnimatePresence>
        {(!isMobile || sidebarOpen) && (
          <motion.aside
            key="sidebar"
            initial={isMobile ? { x: -280 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -280 } : false}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'}
              w-64 flex-shrink-0 flex flex-col
              bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-dark-700
              shadow-xl dark:shadow-none
            `}
          >
            {/* Logo */}
            <div className="p-6 border-b border-slate-100 dark:border-dark-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-blue">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">ISS & News</h1>
                  <p className="text-xs text-slate-400">AI Dashboard</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">Navigation</p>
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleNav(id)}
                  className={`nav-link w-full text-left ${activePage === id ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                  {activePage === id && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                  )}
                </button>
              ))}
            </nav>

            {/* Bottom bar */}
            <div className="p-4 border-t border-slate-100 dark:border-dark-700 space-y-2">
              <button
                onClick={toggleTheme}
                className="btn-ghost w-full justify-start"
                aria-label="Toggle theme"
              >
                {isDark
                  ? <><Sun className="w-4 h-4 text-amber-400" /><span>Light Mode</span></>
                  : <><Moon className="w-4 h-4 text-slate-600" /><span>Dark Mode</span></>
                }
              </button>
              <div className="flex items-center gap-2 px-2">
                <div className="live-dot" />
                <span className="text-xs text-slate-400">Live Tracking Active</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3
          bg-white/80 dark:bg-dark-900/80 backdrop-blur-md
          border-b border-slate-200 dark:border-dark-700 lg:hidden">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="btn-ghost p-2"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary-500" />
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">ISS & News AI</span>
          </div>
          <button onClick={toggleTheme} className="ml-auto btn-ghost p-2" aria-label="Toggle theme">
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </header>

        {/* Desktop top bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4
          bg-white/80 dark:bg-dark-900/80 backdrop-blur-md
          border-b border-slate-200 dark:border-dark-700 sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {NAV_ITEMS.find(n => n.id === activePage)?.label}
            </h2>
            <p className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <div className="live-dot" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Live</span>
            </div>
            <button onClick={toggleTheme} className="btn-ghost p-2" aria-label="Toggle theme">
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
