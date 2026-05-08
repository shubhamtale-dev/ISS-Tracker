import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const NewsContext = createContext(null);

const CACHE_KEY    = 'iss-dashboard-news';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// Fallback mock articles when API key is missing or quota exceeded
const MOCK_ARTICLES = [
  {
    title: 'NASA Artemis Mission: Next Steps to the Moon',
    source: { name: 'Space.com' },
    author: 'Mike Wall',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80',
    description: 'NASA is gearing up for the next phase of its Artemis program, which aims to return humans to the lunar surface by 2026.',
    url: 'https://www.space.com',
  },
  {
    title: 'SpaceX Starship Completes Successful Orbital Test Flight',
    source: { name: 'Reuters' },
    author: 'Joey Roulette',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&q=80',
    description: "SpaceX's Starship rocket completed its most successful test flight to date, reaching orbital altitude and performing a controlled splashdown.",
    url: 'https://www.reuters.com',
  },
  {
    title: 'James Webb Space Telescope Reveals New Exoplanet Atmospheres',
    source: { name: 'Nature' },
    author: 'Alexandra Witze',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80',
    description: 'Scientists using the James Webb Space Telescope have detected water vapor, carbon dioxide and methane in the atmospheres of distant exoplanets.',
    url: 'https://www.nature.com',
  },
  {
    title: 'China Launches New Crew to Tiangong Space Station',
    source: { name: 'BBC News' },
    author: 'Jonathan Amos',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&q=80',
    description: 'China has successfully launched a new three-person crew to its Tiangong space station, continuing its ambitious crewed space program.',
    url: 'https://www.bbc.com',
  },
  {
    title: 'AI Model Discovers Hidden Craters on Mars in New Study',
    source: { name: 'TechCrunch' },
    author: 'Devin Coldewey',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&q=80',
    description: 'Researchers have deployed a neural network that successfully identified thousands of previously unknown impact craters on the Martian surface.',
    url: 'https://techcrunch.com',
  },
  {
    title: 'New Solar Telescope Captures Unprecedented Sun Surface Detail',
    source: { name: 'The Verge' },
    author: 'Loren Grush',
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1532798369041-b33eb576ef16?w=600&q=80',
    description: 'The Daniel K. Inouye Solar Telescope has produced stunning new images of the Sun\'s surface with details never seen before.',
    url: 'https://www.theverge.com',
  },
  {
    title: 'ESA Plans Ambitious Mission to Deflect Near-Earth Asteroid',
    source: { name: 'Guardian' },
    author: 'Ian Sample',
    publishedAt: new Date(Date.now() - 25200000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1615993653eff-56e8a9c2f9cb?w=600&q=80',
    description: 'The European Space Agency has announced plans for HERA, a mission designed to study the aftermath of the DART spacecraft asteroid impact.',
    url: 'https://www.theguardian.com',
  },
  {
    title: 'Astronauts Complete Record-Breaking Spacewalk Duration',
    source: { name: 'CNN' },
    author: 'Ashley Strickland',
    publishedAt: new Date(Date.now() - 28800000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=600&q=80',
    description: 'NASA astronauts completed an eight-hour spacewalk outside the ISS, conducting critical maintenance and installing new science experiments.',
    url: 'https://www.cnn.com',
  },
  {
    title: 'Hubble Celebrates 34 Years with Stunning Galaxy Image',
    source: { name: 'NASA' },
    author: 'Donna Weaver',
    publishedAt: new Date(Date.now() - 32400000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=600&q=80',
    description: 'To celebrate its 34th year in orbit, NASA has released a breathtaking new image from the Hubble Space Telescope showing the Little Dumbbell Nebula.',
    url: 'https://www.nasa.gov',
  },
  {
    title: 'Private Moon Lander Successfully Touches Down Near South Pole',
    source: { name: 'AP News' },
    author: 'Marcia Dunn',
    publishedAt: new Date(Date.now() - 36000000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=600&q=80',
    description: 'A private lunar lander has successfully touched down near the Moon\'s south pole, marking a new era in commercial lunar exploration.',
    url: 'https://apnews.com',
  },
  {
    title: 'Voyager 1 Resumes Sending Scientific Data After Months of Silence',
    source: { name: 'Scientific American' },
    author: 'Lee Billings',
    publishedAt: new Date(Date.now() - 39600000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1454789476662-53eb23ba5907?w=600&q=80',
    description: 'NASA\'s Voyager 1 spacecraft has resumed transmitting scientific data for the first time in five months after engineers solved a complex computer glitch.',
    url: 'https://www.scientificamerican.com',
  },
  {
    title: 'Mars Sample Return Mission Gets Budget Review by NASA',
    source: { name: 'Ars Technica' },
    author: 'Eric Berger',
    publishedAt: new Date(Date.now() - 43200000).toISOString(),
    urlToImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    description: 'NASA is reviewing the Mars Sample Return mission architecture after costs ballooned to an estimated $11 billion, prompting calls for a redesign.',
    url: 'https://arstechnica.com',
  },
];

export function NewsProvider({ children }) {
  const [articles, setArticles]     = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [sortBy, setSortBy]         = useState('date');
  const [lastUpdated, setLastUpdated] = useState(null);

  const applyFilters = useCallback((arts, q, sort) => {
    let result = [...arts];
    if (q.trim()) {
      const lower = q.toLowerCase();
      result = result.filter(
        a =>
          a.title?.toLowerCase().includes(lower) ||
          a.source?.name?.toLowerCase().includes(lower) ||
          a.description?.toLowerCase().includes(lower)
      );
    }
    if (sort === 'date') {
      result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sort === 'source') {
      result.sort((a, b) => (a.source?.name || '').localeCompare(b.source?.name || ''));
    }
    setFiltered(result);
  }, []);

  const fetchNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    // Check localStorage cache
    if (!forceRefresh) {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
          setArticles(cached.articles);
          applyFilters(cached.articles, search, sortBy);
          setLastUpdated(new Date(cached.timestamp));
          setLoading(false);
          return;
        }
      } catch { /* ignore parse errors */ }
    }

    const apiKey = import.meta.env.VITE_NEWS_API_KEY;
    if (!apiKey || apiKey === 'your_newsapi_key_here') {
      // Use mock data
      setArticles(MOCK_ARTICLES);
      applyFilters(MOCK_ARTICLES, search, sortBy);
      setLastUpdated(new Date());
      setLoading(false);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ articles: MOCK_ARTICLES, timestamp: Date.now() }));
      return;
    }

    try {
      const url = `https://newsapi.org/v2/everything?q=space+NASA+ISS+astronomy&sortBy=publishedAt&pageSize=20&language=en&apiKey=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== 'ok') throw new Error(data.message || 'NewsAPI error');

      const arts = (data.articles || []).filter(a => a.title && a.urlToImage).slice(0, 20);
      setArticles(arts);
      applyFilters(arts, search, sortBy);
      setLastUpdated(new Date());
      localStorage.setItem(CACHE_KEY, JSON.stringify({ articles: arts, timestamp: Date.now() }));
      if (forceRefresh) toast.success('News refreshed!');
    } catch (err) {
      console.error('News fetch error:', err);
      setError('Failed to fetch news. Showing cached/demo data.');
      setArticles(MOCK_ARTICLES);
      applyFilters(MOCK_ARTICLES, search, sortBy);
      setLastUpdated(new Date());
      if (forceRefresh) toast.error('News fetch failed, using demo data');
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, applyFilters]);

  useEffect(() => { fetchNews(); }, []);

  useEffect(() => {
    applyFilters(articles, search, sortBy);
  }, [articles, search, sortBy, applyFilters]);

  const refresh = useCallback(() => fetchNews(true), [fetchNews]);

  return (
    <NewsContext.Provider value={{
      articles,
      filtered,
      loading,
      error,
      search,
      setSearch,
      sortBy,
      setSortBy,
      refresh,
      lastUpdated,
    }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const ctx = useContext(NewsContext);
  if (!ctx) throw new Error('useNews must be used within NewsProvider');
  return ctx;
}
