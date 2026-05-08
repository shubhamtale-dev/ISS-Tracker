import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

const ISSContext = createContext(null);

// Haversine formula — distance in km
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const INTERVAL_MS = 15000;
const MAX_POSITIONS = 15;
const MAX_SPEED_HISTORY = 30;

export function ISSProvider({ children }) {
  const [position, setPosition]         = useState(null);
  const [positions, setPositions]       = useState([]);
  const [speed, setSpeed]               = useState(null);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [astronauts, setAstronauts]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [lastUpdated, setLastUpdated]   = useState(null);

  const prevPosRef   = useRef(null);
  const prevTimeRef  = useRef(null);
  const intervalRef  = useRef(null);

  const fetchISS = useCallback(async (showToast = false) => {
    try {
      setError(null);
      // Use a CORS-friendly proxy for open-notify
      const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const lat = parseFloat(data.latitude);
      const lon = parseFloat(data.longitude);
      const ts  = Date.now();

      // Compute speed via Haversine
      let computedSpeed = data.velocity ? (data.velocity * 3.6) : null; // m/s → km/h fallback
      if (prevPosRef.current && prevTimeRef.current) {
        const distKm   = haversine(prevPosRef.current.lat, prevPosRef.current.lon, lat, lon);
        const dtHr     = (ts - prevTimeRef.current) / 3600000;
        if (dtHr > 0) computedSpeed = distKm / dtHr;
      }

      prevPosRef.current  = { lat, lon };
      prevTimeRef.current = ts;

      const newPos = { lat, lon, timestamp: ts };

      setPosition(newPos);
      setPositions(prev => [newPos, ...prev].slice(0, MAX_POSITIONS));
      setSpeed(computedSpeed);
      setSpeedHistory(prev => [
        ...prev,
        { time: new Date(ts).toLocaleTimeString(), speed: Math.round(computedSpeed || 0) },
      ].slice(-MAX_SPEED_HISTORY));
      setLastUpdated(new Date(ts));
      setLoading(false);

      if (showToast) toast.success('ISS position refreshed!');
    } catch (err) {
      console.error('ISS fetch error:', err);
      setError('Failed to fetch ISS position. Retrying…');
      setLoading(false);
      if (showToast) toast.error('ISS fetch failed');
    }
  }, []);

  const fetchAstronauts = useCallback(async () => {
    try {
      const res = await fetch('https://corsproxy.io/?https://api.open-notify.org/astros.json');
      const data = await res.json();
      if (data.people) setAstronauts(data.people);
    } catch {
      // Fallback static data if CORS/network fails
      setAstronauts([
        { name: 'Oleg Kononenko', craft: 'ISS' },
        { name: 'Nikolai Chub', craft: 'ISS' },
        { name: 'Tracy Caldwell Dyson', craft: 'ISS' },
        { name: 'Matthew Dominick', craft: 'ISS' },
        { name: 'Michael Barratt', craft: 'ISS' },
        { name: 'Jeanette Epps', craft: 'ISS' },
        { name: 'Alexander Grebenkin', craft: 'ISS' },
      ]);
    }
  }, []);

  const manualRefresh = useCallback(() => fetchISS(true), [fetchISS]);

  useEffect(() => {
    fetchISS();
    fetchAstronauts();
    intervalRef.current = setInterval(() => fetchISS(), INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchISS, fetchAstronauts]);

  return (
    <ISSContext.Provider value={{
      position,
      positions,
      speed,
      speedHistory,
      astronauts,
      loading,
      error,
      lastUpdated,
      manualRefresh,
    }}>
      {children}
    </ISSContext.Provider>
  );
}

export function useISS() {
  const ctx = useContext(ISSContext);
  if (!ctx) throw new Error('useISS must be used within ISSProvider');
  return ctx;
}
