//app/wbmap/page.tsx

'use client';
import maplibregl, { Map, Marker, Popup, LngLatBounds } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { PLACES, HOTELS } from '../../shared/west-bengal-data';
import { PlaceCategory } from '../../shared/types';

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

export default function WBMap() {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [distanceSetting, setDistanceSetting] = useState<number>(2);
  const [tourMode, setTourMode] = useState(true);
  const [tourPaused, setTourPaused] = useState(false);

  // ✅ keep track of hotel markers + map markers
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

  useEffect(() => {
    // ✅ Override Maplibre default popup box/arrow
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    .maplibregl-popup-content {
      background: transparent !important;
      box-shadow: none !important;
      padding: 0 !important;
      border-radius: 0 !important;
      overflow: visible !important;
    }
    .maplibregl-popup-tip {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}

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

    PLACES.forEach((p) => {
      const icon = document.createElement('div');
      icon.innerHTML = ICON_MAP[p.category] ?? ICON_MAP['Heritage'];
      icon.className = 'cursor-pointer transition-transform duration-200'; // smooth scale

      const marker = new Marker({ element: icon }).setLngLat([p.lon, p.lat]).addTo(map);
      markersRef.current[p.id] = marker;

      marker.getElement().addEventListener('click', () => {
  // reset previous marker
  if (lastActiveMarkerRef.current) {
    lastActiveMarkerRef.current.getElement().style.transform = 'translateY(0) scale(1)';
    lastActiveMarkerRef.current = null;
  }

  // close any open popups
  if (mapRef.current) {
    const popups = document.querySelectorAll(".maplibregl-popup");
    popups.forEach(p => p.remove());
  }

  // 🔑 reset old activeId before assigning new one
  setActiveId(null);
  setTimeout(() => setActiveId(p.id), 0);

  // uplift + enlarge clicked marker
  marker.getElement().style.transform = 'translateY(-10px) scale(1.3)';
  lastActiveMarkerRef.current = marker;

        setActiveId(p.id);
        // const popupRef = useRef<Popup | null>(null);

        // custom popup content
const popupContent = document.createElement('div');
popupContent.className =
  "bg-black/80 text-white rounded-xl w-[240px] flex flex-col items-center overflow-hidden shadow-lg";

// image
if (p.images && p.images.length > 0) {
  const img = document.createElement('img');
  
  // ✅ normalize relative vs absolute
  const firstImage = p.images[0].startsWith('http')
    ? p.images[0]
    : `${window.location.origin}${p.images[0]}`;
  
  img.src = firstImage;
  img.alt = `${p.name} image`;
img.className =
  "w-full h-[140px] object-cover";
  popupContent.appendChild(img);
}


// buttons row
const btnRow = document.createElement('div');
btnRow.className = "flex justify-between w-full mt-2 space-x-2";

const addBtn = document.createElement('button');
addBtn.textContent = "Add to tour plan";
addBtn.className = "flex-1 bg-white/20 hover:bg-white/40 text-xs py-1 px-2 rounded transition";
btnRow.appendChild(addBtn);

const marketBtn = document.createElement('button');
marketBtn.textContent = "Checkout local markets";
marketBtn.className = "flex-1 bg-white/20 hover:bg-white/40 text-xs py-1 px-2 rounded transition";
btnRow.appendChild(marketBtn);

popupContent.appendChild(btnRow);

const popup = new Popup({
  offset: 25,
  closeOnClick: false,
  className: "custom-popup"
})
  .setLngLat([p.lon, p.lat])
  .setDOMContent(popupContent)
  .addTo(map);

// store reference to close it later
marker.getElement().setAttribute("data-popup-id", p.id);

        // ✅ fit bounds to include place + nearby hotels
        const hotelsInRange = HOTELS.filter((h) =>
          haversine(p.lat, p.lon, h.lat, h.lon) <= distanceSetting
        );

        const bounds = new LngLatBounds([p.lon, p.lat], [p.lon, p.lat]);
        hotelsInRange.forEach((h) => bounds.extend([h.lon, h.lat]));

        map.fitBounds(bounds, { padding: 100, maxZoom: 14, duration: 1200 });

        // popup
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
  }, [distanceSetting]);

  // ✅ Add/remove hotel markers when active place changes
  useEffect(() => {
    if (!mapRef.current) return;

    hotelMarkersRef.current.forEach((m) => m.remove());
    hotelMarkersRef.current = [];

    const activePlace = PLACES.find((p) => p.id === activeId);
    if (!activePlace) return;

    const hotelsWithinRadius = HOTELS.filter((h) =>
      haversine(activePlace.lat, activePlace.lon, h.lat, h.lon) <= distanceSetting
    );

    hotelsWithinRadius.forEach((h) => {
      const el = document.createElement('div');
      el.innerHTML = `<img src="/media/icons/hotel.png" width="20" height="20" alt="Hotel" />`;
      const m = new Marker({ element: el }).setLngLat([h.lon, h.lat]).addTo(mapRef.current!);

// open Google Maps on click
      el.addEventListener("click", () => {
      window.open(`https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lon}`, "_blank");
        });

      hotelMarkersRef.current.push(m);

    });
  }, [activeId, distanceSetting]);

  // (Tour logic unchanged)
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
      timeout = setTimeout(flyNext, 7000);
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
  onClick={() => {
    setActiveId(null);

    // reset active marker style
    if (lastActiveMarkerRef.current) {
      lastActiveMarkerRef.current.getElement().style.transform = 'translateY(0) scale(1)';
      lastActiveMarkerRef.current = null;
    }

    // ✅ remove any open popups
    if (mapRef.current) {
      const popups = document.querySelectorAll(".maplibregl-popup");
      popups.forEach((p) => p.remove());
    }
  }}
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