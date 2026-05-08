/**
 * ISS Service
 * Centralised API calls for ISS position, velocity and astronaut data.
 * Used by ISSContext — can be imported directly for one-off queries.
 */

const ISS_API      = 'https://api.wheretheiss.at/v1/satellites/25544';
const ASTRO_API    = 'https://corsproxy.io/?https://api.open-notify.org/astros.json';
const PASS_API     = 'https://api.wheretheiss.at/v1/satellites/25544/positions';

/**
 * Fetch the current ISS position and velocity.
 * @returns {{ lat: number, lon: number, altitude: number, velocity: number, timestamp: number }}
 */
export async function fetchISSPosition() {
  const res = await fetch(ISS_API);
  if (!res.ok) throw new Error(`ISS API error: HTTP ${res.status}`);
  const data = await res.json();
  return {
    lat:       parseFloat(data.latitude),
    lon:       parseFloat(data.longitude),
    altitude:  parseFloat(data.altitude),
    velocity:  parseFloat(data.velocity),   // km/s from the API
    timestamp: Date.now(),
  };
}

/**
 * Fetch the list of people currently in space.
 * Falls back to a static list on network/CORS failure.
 * @returns {Array<{ name: string, craft: string }>}
 */
export async function fetchAstronauts() {
  try {
    const res  = await fetch(ASTRO_API);
    const data = await res.json();
    if (data.people && Array.isArray(data.people)) return data.people;
    throw new Error('Unexpected astronaut API response');
  } catch {
    // Static fallback — updated to current known crew
    return [
      { name: 'Oleg Kononenko',       craft: 'ISS' },
      { name: 'Nikolai Chub',         craft: 'ISS' },
      { name: 'Tracy Caldwell Dyson', craft: 'ISS' },
      { name: 'Matthew Dominick',     craft: 'ISS' },
      { name: 'Michael Barratt',      craft: 'ISS' },
      { name: 'Jeanette Epps',        craft: 'ISS' },
      { name: 'Alexander Grebenkin',  craft: 'ISS' },
    ];
  }
}

/**
 * Fetch multiple ISS positions for a set of Unix timestamps.
 * Useful for trajectory prediction visualisations.
 * @param {number[]} timestamps - Array of Unix timestamps (seconds)
 * @returns {Array<{ lat: number, lon: number, timestamp: number }>}
 */
export async function fetchISSPositionsAtTimes(timestamps) {
  const tsParam = timestamps.join(',');
  const url     = `${PASS_API}?timestamps=${tsParam}&units=kilometers`;
  const res     = await fetch(url);
  if (!res.ok) throw new Error(`ISS positions API error: HTTP ${res.status}`);
  const data    = await res.json();
  return data.map(d => ({
    lat:       parseFloat(d.latitude),
    lon:       parseFloat(d.longitude),
    timestamp: d.timestamp * 1000,
  }));
}
