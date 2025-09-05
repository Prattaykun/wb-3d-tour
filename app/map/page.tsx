'use client';
import maplibregl, { Map, Marker, Popup, LngLatBounds } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { PlaceCategory } from '../../shared/types';
import { supabase } from '../../utils/supabase/server';

const MAP_STYLE =
 `https://api.maptiler.com/maps/${process.env.NEXT_PUBLIC_MAPTILER_STYLE}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;
const WEST_BENGAL_BOUNDS: [number, number, number, number] = [
  85.75, 20.8, 90.8, 27.5
];

// ✅ SVG icons for categories
const ICON_MAP: Record<PlaceCategory, string> = {
  Heritage: '<img src="/media/icons/heritage.png" width="24" height="24" alt="Heritage" />',
  Temple: '<img src="/media/icons/temple.png" width="24" height="24" alt="Temple" />',
  Museum: '<img src="/media/icons/museum.png" width="24" height="24" alt="Museum" />',
  Nature: '<img src="/media/icons/nature.png" width="30" height="30" alt="Nature" />',
  Fort: '<img src="/media/icons/fort.png" width="24" height="24" alt="Fort" />',
  Beach: '<img src="/media/icons/beach.png" width="38" height="38" alt="Beach" />',
  Market: '<img src="/media/icons/market.png" width="38" height="38" alt="Market" />',
  Park: '<img src="/media/icons/park.png" width="38" height="38" alt="Park" />',
  Transport: '<img src="/media/icons/transport.png" width="30" height="30" alt="Transport" />',
  Wildlife: '<img src="/media/icons/wildlife.png" width="30" height="30" alt="Wildlife" />',
  'National Park': '<img src="/media/icons/national-park.png" width="30" height="30" alt="National Park" />',
  Village: '<img src="/media/icons/village.png" width="40" height="40" alt="Village" />',
  Town: '<img src="/media/icons/town.png" width="30" height="30" alt="Town" />',
  Viewpoint: '<img src="/media/icons/viewpoint.png" width="30" height="30" alt="Viewpoint" />',
  'Cultural Site': '<img src="/media/icons/cultural-site.png" width="30" height="30" alt="Cultural Site" />',
  Pilgrimage: '<img src="/media/icons/pilgrimage.png" width="30" height="30" alt="Pilgrimage" />',
  Archaeological: '<img src="/media/icons/a.png" width="30" height="30" alt="Archaeological" />',
  Hillstation: '<img src="/media/icons/mountain.png" width="50" height="50" alt="Mountains" />',
  Engineering: '<img src="/media/icons/engineering.png" width="37" height="37" alt="Engineering" />',
  Religious: '<img src="/media/icons/religious.png" width="30" height="30" alt="Religious" />',
  Lake: '<img src="/media/icons/lake.png" width="30" height="30" alt="Lake" />',
  Shopping: '<img src="/media/icons/shopping.png" width="30" height="30" alt="Shopping" />',
};

interface PlaceSpec {
  id: string;
  name: string;
  category: PlaceCategory;
  lat: number;
  lon: number;
  city?: string;
  description?: string;
  images?: string[];
  google_map_link?: string;
}

interface HotelSpec {
  id: string;
  name: string;
  lat: number;
  lon: number;
  rating?: number;
}

export default function WBMap() {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [places, setPlaces] = useState<PlaceSpec[]>([]);
  const [hotels, setHotels] = useState<HotelSpec[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [distanceSetting, setDistanceSetting] = useState<number>(2);
  const [tourMode, setTourMode] = useState(true);
  const [tourPaused, setTourPaused] = useState(false);
  const visitedRef = useRef<Set<string>>(new Set());

  const hotelMarkersRef = useRef<Marker[]>([]);
  const markersRef = useRef<Record<string, Marker>>({});
  const lastActiveMarkerRef = useRef<Marker | null>(null);

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

  // ✅ Fetch places + hotels from Supabase
  useEffect(() => {
    async function fetchData() {
      const { data: placesData } = await supabase.from('places').select('*');
      const { data: hotelsData } = await supabase.from('hotels').select('*');
      if (placesData) setPlaces(placesData as PlaceSpec[]);
      if (hotelsData) setHotels(hotelsData as HotelSpec[]);

      // start from Dum Dum Airport id
      setActiveId('4633fda9-5fb2-4ea4-ac64-805e8a9673fb');
    }
    fetchData();
  }, []);

  // ✅ Init Map
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

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ✅ Render markers when places load
  useEffect(() => {
    if (!mapRef.current || !places.length) return;

    places.forEach((p) => {
      const icon = document.createElement('div');
      icon.innerHTML = ICON_MAP[p.category] ?? ICON_MAP['Heritage'];
      icon.className = 'cursor-pointer transition-transform duration-200';

      const marker = new Marker({ element: icon }).setLngLat([p.lon, p.lat]).addTo(mapRef.current!);
      markersRef.current[p.id] = marker;

      marker.getElement().addEventListener('click', () => setActiveId(p.id));
    });
  }, [places]);

  // ✅ Handle active place selection
  useEffect(() => {
    if (!mapRef.current || !activeId) return;
    const place = places.find((p) => p.id === activeId);
    if (!place) return;

    // reset prev marker style
    if (lastActiveMarkerRef.current) {
      lastActiveMarkerRef.current.getElement().style.transform = 'translateY(0) scale(1)';
    }

    // uplift marker
    const marker = markersRef.current[place.id];
    if (marker) {
      marker.getElement().style.transform = 'translateY(-10px) scale(1.3)';
      lastActiveMarkerRef.current = marker;
    }

    visitedRef.current.add(place.id);

    mapRef.current.flyTo({
      center: [place.lon, place.lat],
      zoom: 12,
      pitch: 55,
      bearing: -15,
      essential: true,
    });
  }, [activeId, places]);

  // ✅ Add/remove hotel markers
  useEffect(() => {
    if (!mapRef.current || !activeId) return;
    const place = places.find((p) => p.id === activeId);
    if (!place) return;

    hotelMarkersRef.current.forEach((m) => m.remove());
    hotelMarkersRef.current = [];

    const hotelsInRange = hotels.filter((h) =>
      haversine(place.lat, place.lon, h.lat, h.lon) <= distanceSetting
    );

    hotelsInRange.forEach((h) => {
      const el = document.createElement('div');
      el.innerHTML = `<img src="/media/icons/hotel.png" width="20" height="20" alt="Hotel" />`;
      const m = new Marker({ element: el }).setLngLat([h.lon, h.lat]).addTo(mapRef.current!);
      el.addEventListener('click', () => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lon}`, '_blank');
      });
      hotelMarkersRef.current.push(m);
    });
  }, [activeId, distanceSetting, hotels]);

  // ✅ Tour Mode: fly to nearest unvisited
  useEffect(() => {
    if (!tourMode || !mapRef.current || !places.length || !activeId) return;

    let timeout: NodeJS.Timeout;
    const current = places.find((p) => p.id === activeId);
    if (!current) return;

    const flyNext = () => {
      if (tourPaused) return;
      const candidates = places.filter((p) => !visitedRef.current.has(p.id));
      if (!candidates.length) return;

      // find nearest unvisited
      let nearest = candidates[0];
      let minDist = haversine(current.lat, current.lon, nearest.lat, nearest.lon);
      for (const p of candidates) {
        const d = haversine(current.lat, current.lon, p.lat, p.lon);
        if (d < minDist) {
          nearest = p;
          minDist = d;
        }
      }

      setActiveId(nearest.id);
      timeout = setTimeout(flyNext, 7000);
    };

    timeout = setTimeout(flyNext, 7000);
    return () => clearTimeout(timeout);
  }, [tourMode, tourPaused, activeId, places]);

  const activePlace = places.find((p) => p.id === activeId);
  const hotelsWithinRadius = hotels.filter((h) => {
    if (!activePlace) return false;
    return haversine(activePlace.lat, activePlace.lon, h.lat, h.lon) <= distanceSetting;
  });

  return (
    <div className="flex flex-col w-full h-[100vh] relative">
      {/* Controls */}
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
      <div ref={containerRef} className="flex-grow w-full h-full" />

      {/* Info Panel */}
      {activePlace && (
  <div
    className="
      absolute 
      lg:right-0 lg:top-0 
      lg:h-full lg:w-[360px] 
      w-full h-[44%] bottom-0 
      bg-black shadow-lg p-4 overflow-y-auto z-20
      rounded-t-2xl
    "
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
                  src={imgSrc.startsWith('http') ? imgSrc : imgSrc}
                  alt={`${activePlace.name} image ${idx + 1}`}
                  className="rounded-lg w-full h-auto max-h-[200px] object-cover"
                />
              ))}
            </div>
          )}
          {activePlace.description && (
            <p className="text-sm text-gray-400">{activePlace.description}</p>
          )}
          {activePlace.google_map_link && (
            <a
              href={activePlace.google_map_link}
              target="_blank"
              className="text-gray-400 underline mt-2 inline-block text-sm"
            >
              Navigate in Google Maps
            </a>
          )}

          <h4 className="mt-4 font-semibold">
            <span className="text-gray-400">Hotels within {distanceSetting} km</span>
          </h4>
          {!hotelsWithinRadius.length ? (
            <p className="text-sm text-gray-400 mt-1">No hotels in range.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {hotelsWithinRadius.map((h) => (
                <a
                  key={h.id}
                  href={`https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg p-2 hover:shadow text-sm flex flex-col gap-1 cursor-pointer hover:bg-blue-50 transition"
                >
                  <div className="font-medium text-gray-400">{h.name}</div>
                  {h.rating && (
                    <div className="text-xs text-gray-400">Rating: {h.rating}★</div>
                  )}
                </a>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
