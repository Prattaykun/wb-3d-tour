'use client';
import maplibregl, { Map, Marker, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { PLACES, HOTELS } from '../shared/west-bengal-data';

const MAP_STYLE =
  'https://api.maptiler.com/maps/0198af0b-fbe1-7f50-a185-309898d6f3d8/style.json?key=1tMBnuPMA9Xr8NFzcajb';
const WEST_BENGAL_BOUNDS: [number, number, number, number] = [
  85.75, 20.8, 90.8, 27.5
];


export default function WBMap() {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [distanceSetting, setDistanceSetting] = useState<number>(2);
  const [tourMode, setTourMode] = useState(true);
  const [tourPaused, setTourPaused] = useState(false);

  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [88.3639, 22.5726],
      zoom: 5.7,
      pitch: 50,
      bearing: -20,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.setMaxBounds(WEST_BENGAL_BOUNDS);

// ✅ wrap border logic
map.on('load', () => {
  map.addSource('wbBorder', {
    type: 'geojson',
    data: '/geo/west_bengal_border.geojson'
  });
  map.addLayer({
    id: 'wbBorderLine',
    type: 'line',
    source: 'wbBorder',
    paint: {
      'line-color': '#0be2f9ff',
      'line-width': 2
    }
  });
});

    PLACES.forEach((p) => {
      const icon = document.createElement('div');
      icon.innerHTML = `
        <svg height="24" width="24" viewBox="0 0 24 24">
          <path fill="#e11d48" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
        </svg>`;
      icon.className = 'cursor-pointer';

      const marker = new Marker({ element: icon }).setLngLat([p.lon, p.lat]).addTo(map);

      marker.getElement().addEventListener('click', () => {
        setActiveId(p.id);
        map.flyTo({ center: [p.lon, p.lat], zoom: 12, pitch: 60, bearing: -10, essential: true });
        new Popup({ offset: 12 })
          .setLngLat([p.lon, p.lat])
          .setHTML(`<div style="font-weight:600">${p.name}</div><div style="font-size:12px">${p.city ?? ''}</div>`)
          .addTo(map);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);
  // Auto-tour mode
  useEffect(() => {
    if (!tourMode || !mapRef.current) return;

    let idx = 0;
    let timeout: NodeJS.Timeout;

    const flyNext = () => {
      if (tourPaused) return;

      const place = PLACES[idx % PLACES.length];
      mapRef.current!.flyTo({
        center: [place.lon, place.lat],
        zoom: 12,
        pitch: 55,
        bearing: -15,
        essential: true,
      });
      setActiveId(place.id);
      idx++;
      timeout = setTimeout(flyNext, 7000); // Wait 7s
    };

    flyNext();
    return () => clearTimeout(timeout);
  }, [tourMode, tourPaused]);

  const activePlace = PLACES.find((p) => p.id === activeId);
  const hotelsWithinRadius = HOTELS.filter((h) => {
    if (!activePlace) return false;
    return haversine(activePlace.lat, activePlace.lon, h.lat, h.lon) <= distanceSetting;
  });

  return (
    <div className="flex flex-col w-full h-[100vh] relative">
      {/* Top-left controls */}
      <div className="absolute top-4 left-4 bg-black p-2 rounded-md shadow z-10 flex flex-wrap gap-2 items-center">
        <label className="text-xs text-gray-400">Radius:</label>
        <select
          value={distanceSetting}
          onChange={(e) => setDistanceSetting(Number(e.target.value))}
          className="border text-xs p-1 text-gray-400"
        >
          <option value={0.3}>300 m</option>
          <option value={1}>1 km</option>
          <option value={2}>2 km</option>
          <option value={3}>3 km</option>
          <option value={5}>5 km</option>
        </select>
        <label className="text-xs text-gray-400">Tour Guide</label>
        <input type="checkbox" checked={tourMode} onChange={() => setTourMode(!tourMode)} />
        {tourMode && (
          <button
        onClick={() => setTourPaused((p) => !p)}
        className="text-xs bg-blue-100 px-2 py-1 rounded text-gray-800 font-semibold"
          >
        {tourPaused ? '▶️ Play' : '⏸️ Pause'}
          </button>
        )}
      </div>

      {/* Map */}
      <div ref={containerRef} className="flex-grow w-full h-full max-[500px]:h-[50vh]" />

      {/* Info Panel */}
      {activePlace && (
      <div
        className="
           absolute right-0 top-0
            lg:top-0 
            h-full lg:h-full 
            w-full lg:w-[360px]
            bg-black shadow-lg p-4 overflow-y-auto z-20
            max-[500px]:bottom-0 max-[500px]:top-auto max-[500px]:h-[44vh]"
        >
          <button
            className="text-xs text-red-500 absolute right-4 top-4"
            onClick={() => setActiveId(null)}
          >
            ✕ Close
          </button>
          <h3 className="text-xl font-semibold mt-4 text-gray-400">{activePlace.name}</h3>
          <p className="text-xs text-gray-400 mb-2">
            {activePlace.city} • {activePlace.category}
          </p>
          {activePlace.images && activePlace.images.length > 0 && (
             <div className="mt-4 flex flex-wrap gap-2">
               {activePlace.images.map((imgSrc: string, idx: number) => (
                <img
                  key={idx}
                  src={imgSrc.startsWith('http') ? imgSrc : imgSrc}   // already clean path now
                  alt={`${activePlace.name} image ${idx + 1}`}
                  className="rounded-lg w-full h-auto max-h-[200px] object-cover"
                />
              ))
              }
            </div>
          )}
          {activePlace.description && (
            <p className="text-sm text-gray-400">{activePlace.description}</p>
          )}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${activePlace.lat},${activePlace.lon}`}
            target="_blank"
            className="text-gray-400 underline mt-2 inline-block text-sm"
          >
            Navigate in Google Maps
          </a>

          <h4 className="mt-4 font-semibold">
            <span className="text-gray-400">Hotels within {distanceSetting} km</span>
          </h4>
          {!hotelsWithinRadius.length ? (
            <p className="text-sm text-gray-400 mt-1">No hotels in range.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {hotelsWithinRadius.map((h) => (
                <li key={h.id} className="border rounded-lg p-2 hover:shadow text-sm">
                  <div className="font-medium text-gray-400">{h.name}</div>
                  {h.rating && (
                    <div className="text-xs text-gray-400">Rating: {h.rating}★</div>
                  )}
                </li>
              ))}
            </ul>
          )}
            
        </div>
      )}
    </div>
  );
} 

