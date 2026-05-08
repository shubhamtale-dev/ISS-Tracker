/**
 * Utility formatters for the ISS & News AI Dashboard.
 */

// ─── Number formatters ───────────────────────────────────────────────────────

/**
 * Format a speed value in km/h with thousands separator.
 * @param {number|null} kmh
 * @returns {string}
 */
export function formatSpeed(kmh) {
  if (kmh == null || isNaN(kmh)) return '—';
  return `${Math.round(kmh).toLocaleString()} km/h`;
}

/**
 * Format an altitude value in kilometres.
 * @param {number|null} km
 * @returns {string}
 */
export function formatAltitude(km) {
  if (km == null || isNaN(km)) return '—';
  return `${km.toFixed(1)} km`;
}

/**
 * Format a coordinate to N/S or E/W notation.
 * @param {number} value
 * @param {'lat'|'lon'} type
 * @returns {string}
 */
export function formatCoordinate(value, type) {
  if (value == null || isNaN(value)) return '—';
  const abs = Math.abs(value).toFixed(4);
  if (type === 'lat') return `${abs}° ${value >= 0 ? 'N' : 'S'}`;
  return `${abs}° ${value >= 0 ? 'E' : 'W'}`;
}

/**
 * Compact number formatter (e.g. 27600 → "27.6k").
 * @param {number} n
 * @returns {string}
 */
export function formatCompact(n) {
  if (n == null || isNaN(n)) return '—';
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

// ─── Date / time formatters ──────────────────────────────────────────────────

/**
 * Format a Date (or ISO string) as a human-readable relative string.
 * e.g. "2 minutes ago", "just now"
 * @param {Date|string|number} date
 * @returns {string}
 */
export function timeAgo(date) {
  const now     = Date.now();
  const ts      = new Date(date).getTime();
  const diffSec = Math.round((now - ts) / 1000);

  if (diffSec < 10)   return 'just now';
  if (diffSec < 60)   return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

/**
 * Format a Date as a short locale date string.
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day:   'numeric',
      year:  'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Format a Date as HH:MM:SS.
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatTime(date) {
  try {
    return new Date(date).toLocaleTimeString('en-US', {
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return '—';
  }
}

/**
 * Format a duration in milliseconds as "Xm Ys".
 * @param {number} ms
 * @returns {string}
 */
export function formatDuration(ms) {
  if (ms == null || ms < 0) return '—';
  const totalSec = Math.round(ms / 1000);
  const min      = Math.floor(totalSec / 60);
  const sec      = totalSec % 60;
  if (min === 0) return `${sec}s`;
  return `${min}m ${sec}s`;
}

// ─── String helpers ──────────────────────────────────────────────────────────

/**
 * Truncate a string to maxLength with an ellipsis.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 80) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength).trimEnd()}…`;
}

/**
 * Capitalise the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
