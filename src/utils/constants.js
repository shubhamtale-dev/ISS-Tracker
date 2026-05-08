/**
 * App-wide constants for the ISS & News AI Dashboard.
 * Import specific values rather than the whole module where possible.
 */

// ─── App meta ────────────────────────────────────────────────────────────────
export const APP_NAME        = 'ISS & News AI Dashboard';
export const APP_VERSION     = '1.0.0';

// ─── ISS polling ─────────────────────────────────────────────────────────────
export const ISS_POLL_INTERVAL_MS  = 15_000;   // 15 seconds
export const ISS_MAX_POSITIONS     = 15;        // trail length on map
export const ISS_MAX_SPEED_HISTORY = 30;        // chart data points

// ─── ISS orbital facts (static reference) ────────────────────────────────────
export const ISS_ORBITAL_ALTITUDE_KM = 408;     // approximate
export const ISS_ORBITAL_PERIOD_MIN  = 92;      // approximate
export const ISS_ORBITS_PER_DAY      = 15.5;    // approximate
export const ISS_CREW_CAPACITY       = 7;
export const ISS_AVERAGE_SPEED_KMH   = 27_600;  // km/h

// ─── News / cache ─────────────────────────────────────────────────────────────
export const NEWS_CACHE_KEY        = 'iss-dashboard-news';
export const NEWS_CACHE_TTL_MS     = 15 * 60 * 1000;   // 15 minutes
export const NEWS_DEFAULT_QUERY    = 'space NASA ISS astronomy moon rocket satellite';
export const NEWS_MAX_ARTICLES     = 20;

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const CHAT_STORAGE_KEY      = 'iss-dashboard-chat';
export const CHAT_MAX_MESSAGES     = 30;

// ─── Theme ────────────────────────────────────────────────────────────────────
export const THEME_STORAGE_KEY     = 'iss-dashboard-theme';

// ─── API endpoints ────────────────────────────────────────────────────────────
export const ENDPOINTS = {
  ISS_POSITION:  'https://api.wheretheiss.at/v1/satellites/25544',
  ISS_POSITIONS: 'https://api.wheretheiss.at/v1/satellites/25544/positions',
  ASTRONAUTS:    'https://corsproxy.io/?https://api.open-notify.org/astros.json',
  NEWS_API:      'https://newsapi.org/v2/everything',
  HUGGING_FACE:  'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
};

// ─── Map tile layers ──────────────────────────────────────────────────────────
export const MAP_TILES = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 20,
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 20,
  },
};

// ─── Chart colours ────────────────────────────────────────────────────────────
export const CHART_COLORS = [
  '#3b82f6',   // blue
  '#8b5cf6',   // violet
  '#10b981',   // emerald
  '#f59e0b',   // amber
  '#f43f5e',   // rose
  '#06b6d4',   // cyan
  '#84cc16',   // lime
  '#ec4899',   // pink
  '#f97316',   // orange
  '#6366f1',   // indigo
];

// ─── Navigation items ─────────────────────────────────────────────────────────
export const NAV_PAGES = ['iss', 'news', 'charts'];

// ─── AI chatbot suggestions ───────────────────────────────────────────────────
export const CHAT_SUGGESTIONS = [
  'Where is the ISS right now?',
  'How fast is the ISS going?',
  'Who is in space right now?',
  'Show me the latest news headlines',
  'What is the ISS altitude?',
  'How many people are in space?',
];
