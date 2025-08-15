'use client';
import maplibregl, { Map, Marker, LngLatBoundsLike, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { PLACES, HOTELS } from '../shared/west-bengal-data';

// Using MapTiler free style (you can create an account and get a key)
const MAP_STYLE = 'https://api.maptiler.com/maps/0198af0b-fbe1-7f50-a185-309898d6f3d8/style.json?key=1tMBnuPMA9Xr8NFzcajb';

const WEST_BENGAL_BOUNDS: LngLatBoundsLike = [
  [85.75, 20.8],
  [90.8, 27.5],
];

export default function WBMap() {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [88.3639, 22.5726],
      zoom: 5.7,
      pitch: 50, // tilt camera for a pseudo-3D feel
      bearing: -20,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      // Constrain initial bounds
      map.setMaxBounds(WEST_BENGAL_BOUNDS);
         map.addSource('wbBorder', {
         type: 'geojson',
        data: '/geo/west_bengal_border.geojson'
        });

        map.addLayer({
        id: 'wbBorderLine',
        type: 'line',
        source: 'wbBorder',
        paint: {
         'line-color': '#e11d48',
          'line-width': 2
        }
        });

      // Drop markers
      PLACES.forEach((p) => {
        const el = document.createElement('div');
        el.className = 'rounded-full bg-rose-600 shadow-lg w-3 h-3 ring-2 ring-white cursor-pointer';
        const marker = new Marker({ element: el }).setLngLat([p.lon, p.lat]).addTo(map);
        marker.getElement().addEventListener('click', () => {
          setActiveId(p.id);
          map.flyTo({ center: [p.lon, p.lat], zoom: 12, pitch: 60, bearing: -10, essential: true });
          new Popup({ offset: 12 })
            .setLngLat([p.lon, p.lat])
            .setHTML(`<div style="font-weight:600">${p.name}</div><div style="font-size:12px">${p.city ?? ''}</div>`)
            .addTo(map);
        });
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const activePlace = PLACES.find((p) => p.id === activeId);
  const hotels = HOTELS.filter((h) => h.nearPlaceId === activeId);

  return (
    <div className="w-full h-[100vh] grid grid-cols-1 lg:grid-cols-[1fr_380px]">
      <div ref={containerRef} className="w-full h-full" />
      {/* side panel same as before */}
      {/* ---- You can keep the same JSX for the side panel and hotel info ---- */}
    </div>
  );
}
