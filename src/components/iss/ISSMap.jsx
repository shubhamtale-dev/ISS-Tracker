import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useISS } from '../../context/ISSContext';

// Fix default icon issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom ISS marker icon
const issIcon = L.divIcon({
  className: 'iss-custom-marker',
  html: `
    <div style="
      width: 44px; height: 44px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: 3px solid white;
      box-shadow: 0 0 20px rgba(59,130,246,0.7), 0 4px 12px rgba(0,0,0,0.3);
      animation: issGlow 2s ease-in-out infinite alternate;
    ">
      <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
        <path d="M12 2L8 7H4l2 5-4 3 4 1 1 4 5-3 5 3 1-4 4-1-4-3 2-5h-4L12 2z"/>
      </svg>
    </div>
    <style>
      @keyframes issGlow {
        0% { box-shadow: 0 0 10px rgba(59,130,246,0.5); }
        100% { box-shadow: 0 0 25px rgba(59,130,246,0.9), 0 0 50px rgba(139,92,246,0.4); }
      }
    </style>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -25],
});

// Historical marker icon
const histIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:8px; height:8px;
    background:#60a5fa;
    border-radius:50%;
    border: 1.5px solid white;
    opacity:0.7;
  "></div>`,
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

function RecenterMap({ lat, lon }) {
  const map = useMap();
  React.useEffect(() => {
    if (lat !== undefined && lon !== undefined) {
      map.setView([lat, lon], map.getZoom(), { animate: true, duration: 1 });
    }
  }, [lat, lon, map]);
  return null;
}

export default function ISSMap() {
  const { position, positions } = useISS();

  const polylinePositions = useMemo(
    () => positions.map(p => [p.lat, p.lon]),
    [positions]
  );

  const center = position ? [position.lat, position.lon] : [0, 0];

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200 dark:ring-dark-700">
      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        {/* Dark tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {/* Trajectory polyline */}
        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{
              color: '#60a5fa',
              weight: 2.5,
              opacity: 0.7,
              dashArray: '6 4',
            }}
          />
        )}

        {/* Historical position markers */}
        {positions.slice(1).map((p, i) => (
          <Marker key={i} position={[p.lat, p.lon]} icon={histIcon}>
            <Popup>
              <div className="text-xs font-mono">
                <p className="font-semibold mb-1">Previous Position</p>
                <p>Lat: {p.lat.toFixed(4)}°</p>
                <p>Lon: {p.lon.toFixed(4)}°</p>
                <p>{new Date(p.timestamp).toLocaleTimeString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Live ISS Marker */}
        {position && (
          <>
            <RecenterMap lat={position.lat} lon={position.lon} />
            <Marker position={[position.lat, position.lon]} icon={issIcon}>
              <Popup>
                <div className="text-sm font-mono min-w-[160px]">
                  <p className="font-bold text-primary-600 mb-2">🛸 ISS — Live</p>
                  <p>Lat: <strong>{position.lat.toFixed(4)}°</strong></p>
                  <p>Lon: <strong>{position.lon.toFixed(4)}°</strong></p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(position.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      {/* Live overlay badge */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-900/80 backdrop-blur-sm border border-dark-600 text-white text-xs font-medium shadow-lg">
        <div className="live-dot" />
        ISS Live Tracking
      </div>

      {position && (
        <div className="absolute bottom-3 right-3 z-[400] px-3 py-1.5 rounded-full bg-dark-900/80 backdrop-blur-sm border border-dark-600 text-white text-xs font-mono shadow-lg">
          {position.lat.toFixed(2)}°, {position.lon.toFixed(2)}°
        </div>
      )}
    </div>
  );
}
