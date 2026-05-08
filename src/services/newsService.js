/**
 * News Service
 * Centralised fetching layer for the NewsAPI.
 * Handles caching, API key resolution and fallback mock data.
 */

const CACHE_KEY    = 'iss-dashboard-news';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const DEFAULT_QUERY  = 'space NASA ISS astronomy moon rocket satellite';
const DEFAULT_LANG   = 'en';
const DEFAULT_SORT   = 'publishedAt';
const DEFAULT_PAGE_SIZE = 20;

// ─── Mock data fallback ──────────────────────────────────────────────────────

export const MOCK_ARTICLES = [
  {
    title: 'NASA Artemis Mission: Next Steps to the Moon',
    source: { name: 'Space.com' },
    author: 'Mike Wall',
    publishedAt: new Date(Date.now() - 3_600_000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80',
    description: 'NASA is gearing up for the next phase of its Artemis program, which aims to return humans to the lunar surface by 2026.',
    url: 'https://www.space.com',
  },
  {
    title: 'SpaceX Starship Completes Successful Orbital Test Flight',
    source: { name: 'Reuters' },
    author: 'Joey Roulette',
    publishedAt: new Date(Date.now() - 7_200_000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&q=80',
    description: 'SpaceX Starship completed its most successful test flight, reaching orbital altitude and performing a controlled splashdown.',
    url: 'https://www.reuters.com',
  },
  {
    title: 'James Webb Telescope Reveals New Exoplanet Atmospheres',
    source: { name: 'Nature' },
    author: 'Alexandra Witze',
    publishedAt: new Date(Date.now() - 10_800_000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80',
    description: 'Scientists detected water vapor, CO₂ and methane in the atmospheres of distant exoplanets using JWST.',
    url: 'https://www.nature.com',
  },
  {
    title: 'China Launches New Crew to Tiangong Space Station',
    source: { name: 'BBC News' },
    author: 'Jonathan Amos',
    publishedAt: new Date(Date.now() - 14_400_000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&q=80',
    description: 'China launched a new three-person crew to its Tiangong space station, continuing its crewed space program.',
    url: 'https://www.bbc.com',
  },
  {
    title: 'AI Model Discovers Hidden Craters on Mars',
    source: { name: 'TechCrunch' },
    author: 'Devin Coldewey',
    publishedAt: new Date(Date.now() - 18_000_000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&q=80',
    description: 'A neural network identified thousands of previously unknown impact craters on the Martian surface.',
    url: 'https://techcrunch.com',
  },
  {
    title: 'New Solar Telescope Captures Unprecedented Sun Detail',
    source: { name: 'The Verge' },
    author: 'Loren Grush',
    publishedAt: new Date(Date.now() - 21_600_000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1532798369041-b33eb576ef16?w=600&q=80',
    description: 'The Inouye Solar Telescope produced stunning new images of the Sun with never-before-seen detail.',
    url: 'https://www.theverge.com',
  },
  {
    title: 'ESA Plans Mission to Deflect Near-Earth Asteroid',
    source: { name: 'The Guardian' },
    author: 'Ian Sample',
    publishedAt: new Date(Date.now() - 25_200_000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1615993653eff-56e8a9c2f9cb?w=600&q=80',
    description: 'ESA announced plans for HERA, a mission to study the aftermath of the DART spacecraft asteroid impact.',
    url: 'https://www.theguardian.com',
  },
  {
    title: 'Astronauts Complete Record-Breaking Spacewalk',
    source: { name: 'CNN' },
    author: 'Ashley Strickland',
    publishedAt: new Date(Date.now() - 28_800_000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=600&q=80',
    description: 'NASA astronauts completed an eight-hour spacewalk outside the ISS, conducting critical maintenance.',
    url: 'https://www.cnn.com',
  },
  {
    title: 'Hubble Celebrates 34 Years with Stunning Galaxy Image',
    source: { name: 'NASA' },
    author: 'Donna Weaver',
    publishedAt: new Date(Date.now() - 32_400_000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=600&q=80',
    description: 'NASA released a breathtaking new image from the Hubble Space Telescope showing the Little Dumbbell Nebula.',
    url: 'https://www.nasa.gov',
  },
  {
    title: 'Private Moon Lander Touches Down Near South Pole',
    source: { name: 'AP News' },
    author: 'Marcia Dunn',
    publishedAt: new Date(Date.now() - 36_000_000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=600&q=80',
    description: 'A private lunar lander successfully touched down near the Moon\'s south pole in a landmark commercial mission.',
    url: 'https://apnews.com',
  },
  {
    title: 'Voyager 1 Resumes Sending Scientific Data',
    source: { name: 'Scientific American' },
    author: 'Lee Billings',
    publishedAt: new Date(Date.now() - 39_600_000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1454789476662-53eb23ba5907?w=600&q=80',
    description: 'NASA\'s Voyager 1 has resumed transmitting scientific data after engineers solved a complex computer glitch.',
    url: 'https://www.scientificamerican.com',
  },
  {
    title: 'Mars Sample Return Mission Gets Budget Review',
    source: { name: 'Ars Technica' },
    author: 'Eric Berger',
    publishedAt: new Date(Date.now() - 43_200_000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    description: 'NASA is reviewing the Mars Sample Return mission architecture after costs ballooned to an estimated $11 billion.',
    url: 'https://arstechnica.com',
  },
];

// ─── Cache helpers ───────────────────────────────────────────────────────────

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) return cached;
    return null;
  } catch {
    return null;
  }
}

function writeCache(articles) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ articles, timestamp: Date.now() }));
  } catch { /* ignore quota errors */ }
}

export function clearNewsCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}

// ─── Main fetch ──────────────────────────────────────────────────────────────

/**
 * Fetch space news articles.
 * Uses localStorage cache; falls back to mock data when the API key is absent
 * or the quota is exhausted.
 *
 * @param {{ forceRefresh?: boolean, query?: string }} options
 * @returns {Promise<{ articles: object[], fromCache: boolean, usedMock: boolean }>}
 */
export async function fetchNews({ forceRefresh = false, query = DEFAULT_QUERY } = {}) {
  // Try cache first
  if (!forceRefresh) {
    const cached = readCache();
    if (cached) return { articles: cached.articles, fromCache: true, usedMock: false };
  }

  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  if (!apiKey || apiKey === 'your_newsapi_key_here') {
    writeCache(MOCK_ARTICLES);
    return { articles: MOCK_ARTICLES, fromCache: false, usedMock: true };
  }

  const url = [
    'https://newsapi.org/v2/everything',
    `?q=${encodeURIComponent(query)}`,
    `&sortBy=${DEFAULT_SORT}`,
    `&pageSize=${DEFAULT_PAGE_SIZE}`,
    `&language=${DEFAULT_LANG}`,
    `&apiKey=${apiKey}`,
  ].join('');

  const res  = await fetch(url);
  const data = await res.json();

  if (data.status !== 'ok') {
    throw new Error(data.message || 'NewsAPI returned a non-ok status');
  }

  const articles = (data.articles || [])
    .filter(a => a.title && a.urlToImage)
    .slice(0, DEFAULT_PAGE_SIZE);

  writeCache(articles);
  return { articles, fromCache: false, usedMock: false };
}
