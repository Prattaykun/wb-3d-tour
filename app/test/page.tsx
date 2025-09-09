// app/map/page.tsx
'use client';
import maplibregl, { Map, Marker, Popup, LngLatBounds } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { PlaceCategory } from '../../shared/types';
import { createClient } from '@supabase/supabase-js';
import { useMemo } from 'react';
import ArtifactsNearby from '@/components/Artifacts/ArtifactsNearby';



const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MAP_STYLE = `https://api.maptiler.com/maps/${process.env.NEXT_PUBLIC_MAPTILER_STYLE}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;
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

interface TourPlanPlace {
  id: string;
  name: string;
  city?: string;
}
interface ArtisanData {
  artisan_id: string;
  full_name: string;
  email: string;
  phone: string;
  products: any[];
  created_at: string;
  updated_at: string;
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
  const [showTourPlan, setShowTourPlan] = useState(false);
  const [tourPlan, setTourPlan] = useState<TourPlanPlace[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const visitedRef = useRef<Set<string>>(new Set());
  const [artisans, setArtisans] = useState<ArtisanData[]>([]);
  const hotelMarkersRef = useRef<Marker[]>([]);
  const markersRef = useRef<Record<string, Marker>>({});
  const lastActiveMarkerRef = useRef<Marker | null>(null);
   const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  // Check if user is on a native platform
  // Move these functions to the main component body
  const toggleDescription = (placeId: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(placeId)) {
      newExpanded.delete(placeId);
    } else {
      newExpanded.add(placeId);
    }
    setExpandedDescriptions(newExpanded);
  };

  // Helper function to truncate text
  const truncateWords = (text: string, maxWords: number) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };
  useEffect(() => {
    // Simple check for native platforms (can be enhanced based on your needs)
    const userAgent = navigator.userAgent || navigator.vendor;
    setIsNative(
      /android|iphone|ipad|ipod|windows phone|mobile/i.test(userAgent)
    );
  }, []);
  // Add this useEffect to fetch artisans
  useEffect(() => {
  async function fetchArtisans() {
    const { data: artisansData } = await supabase.from('artifacts').select('*');
    if (artisansData) setArtisans(artisansData as ArtisanData[]);
  }
  fetchArtisans();
}, []);
  // Add shop markers effect
// Add shop markers effect
const shopMarkersRef = useRef<Marker[]>([]);
useEffect(() => {
  if (!mapRef.current || !activeId || !artisans.length) return;
  const place = places.find((p) => p.id === activeId);
  if (!place) return;

  // Remove existing shop markers
  shopMarkersRef.current.forEach((m) => m.remove());
  shopMarkersRef.current = [];

  // Flatten all shops from all artisans
  const allShops = artisans.flatMap(artisan => 
    artisan.products.map((shop: any) => ({
      ...shop,
      artisan: {
        full_name: artisan.full_name,
        email: artisan.email,
        phone: artisan.phone
      }
    }))
  );
    // Filter shops by distance
  const shopsInRange = allShops.filter((shop: any) =>
    haversine(place.lat, place.lon, shop.latitude, shop.longitude) <= distanceSetting
  );

  // Add markers for shops
  shopsInRange.forEach((shop: any) => {
    const el = document.createElement('div');
    el.innerHTML = `<div class="animated-marker">
      <img src="/media/icons/shop.png" width="24" height="24" alt="Shop" />
    </div>`;
    el.className = 'cursor-pointer';
    
    const marker = new Marker({ element: el })
      .setLngLat([shop.longitude, shop.latitude])
      .addTo(mapRef.current!);
    
    el.addEventListener('click', () => {
      // You could add a click handler for shop markers if needed
    });
    
    shopMarkersRef.current.push(marker);
  });
}, [activeId, distanceSetting, artisans]);


  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  
  // Fetch user's tour plan from visit_places column
  useEffect(() => {
    const fetchTourPlan = async () => {
      if (!user) {
        setTourPlan([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('consumer_profiles')
          .select('visit_places')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching tour plan:', error);
          return;
        }

        if (data?.visit_places) {
          // Filter out null values and ensure we have an array of TourPlanPlace
          const validPlaces = data.visit_places.filter((place: any) => place !== null) as TourPlanPlace[];
          setTourPlan(validPlaces);
        } else {
          setTourPlan([]);
        }
      } catch (error) {
        console.error('Error fetching tour plan:', error);
      }
    };

    fetchTourPlan();
  }, [user]);

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

  // Add place to tour plan (using visit_places column)
  const addToTourPlan = async (place: PlaceSpec) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      // Check if place already exists in tour plan
      if (tourPlan.some(p => p.id === place.id)) {
        return; // Place already in tour plan
      }

      const newPlace: TourPlanPlace = {
        id: place.id,
        name: place.name,
        city: place.city
      };

      const updatedTourPlan = [...tourPlan, newPlace];
      
      // Update the database using visit_places column
      const { error } = await supabase
        .from('consumer_profiles')
        .upsert({
          id: user.id,
          visit_places: updatedTourPlan,
          updated_at: new Date().toISOString()
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error('Error updating tour plan:', error);
        return;
      }

      setTourPlan(updatedTourPlan);
    } catch (error) {
      console.error('Error adding to tour plan:', error);
    }
  };

  // Remove place from tour plan (using visit_places column)
  const removeFromTourPlan = async (placeId: string) => {
    if (!user) return;

    try {
      const updatedTourPlan = tourPlan.filter(p => p.id !== placeId);
      
      // Update the database using visit_places column
      const { error } = await supabase
        .from('consumer_profiles')
        .upsert({
          id: user.id,
          visit_places: updatedTourPlan,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating tour plan:', error);
        return;
      }

      setTourPlan(updatedTourPlan);
    } catch (error) {
      console.error('Error removing from tour plan:', error);
    }
  };

  const activePlace = places.find((p) => p.id === activeId);
  const hotelsWithinRadius = hotels.filter((h) => {
    if (!activePlace) return false;
    return haversine(activePlace.lat, activePlace.lon, h.lat, h.lon) <= distanceSetting;
  });

  return (
    <div className="flex flex-col w-full h-[100vh] relative">
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Login Required</h3>
            <p className="mb-4">You need to be logged in to add places to your tour plan.</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowLoginPrompt(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => window.location.href = '/auth/login'}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tour Plan Dropdown - Centered on native devices */}
      {showTourPlan && (
        <div className={`absolute ${isNative ? 'inset-4 m-auto h-fit max-h-[80vh]' : 'top-16 right-4'} bg-white shadow-lg rounded-lg p-4 z-30 max-w-md w-full max-h-96 overflow-y-auto`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Your Tour Plan</h3>
            <button 
              onClick={() => setShowTourPlan(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          {tourPlan.length === 0 ? (
            <p className="text-gray-500">No places in your tour plan yet.</p>
          ) : (
            <div className="space-y-3">
              {tourPlan.map((place) => (
                <div key={place.id} className="flex justify-between items-start p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{place.name}</h4>
                    {place.city && <p className="text-sm text-gray-600">{place.city}</p>}
                  </div>
                  <button 
                    onClick={() => removeFromTourPlan(place.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {/* Build Plan with AI Button */}
              <button
                onClick={() => window.location.href = '/MyTourPlan'}
                className="w-full mt-4 p-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
              >
                Build Plan with AI
              </button>
            </div>
          )}
        </div>
      )}

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

      {/* Tour Plan Button - Position based on device type */}
      <div className={`absolute top-4 z-10 ${isNative ? 'right-4' : 'left-1/2 transform -translate-x-1/2'}`}>
        <button 
          onClick={() => setShowTourPlan(!showTourPlan)}
          className="bg-black text-white px-4 py-2 rounded-md shadow flex items-center gap-2"
        >
          {isNative ? (
            <img src="/media/icons/ai.png" width={24} height={24} alt="AI Tour Plan" />
          ) : (
            <>
              <img src="/media/icons/ai.png" width={20} height={20} alt="AI" className="mr-1" />
              <span>Your Tour Plan</span>
              {tourPlan.length > 0 && (
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {tourPlan.length}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Map */}
      <div ref={containerRef} className="flex-grow w-full h-full" />

      {/* Info Panel */}
      {activePlace && (
        <div className="absolute lg:right-0 lg:top-0 lg:h-full lg:w-[360px] w-full h-[44%] bottom-0 bg-black shadow-lg p-4 overflow-y-auto z-20 rounded-t-2xl">
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
          
          {/* Add to Tour Plan Button */}
          <button
            onClick={() => addToTourPlan(activePlace)}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Add to Tour Plan
          </button>

          {/* Horizontally scrollable images */}
          {activePlace.images && activePlace.images.length > 0 && (
            <div className="mt-4 flex overflow-x-auto gap-2 py-2">
              {activePlace.images.map((imgSrc: string, idx: number) => (
                <img
                  key={idx}
                  src={imgSrc.startsWith('http') ? imgSrc : imgSrc}
                  alt={`${activePlace.name} image ${idx + 1}`}
                  className="rounded-lg h-32 w-auto object-cover flex-shrink-0"
                />
              ))}
            </div>
          )}
          
          {/* Description with Read More option */}
          {activePlace.description && (
            <div className="mt-3">
              <p className="text-sm text-gray-400">
                {expandedDescriptions.has(activePlace.id) 
                  ? activePlace.description 
                  : truncateWords(activePlace.description, 20)}
              </p>
              {activePlace.description.split(' ').length > 20 && (
                <button 
                  onClick={() => toggleDescription(activePlace.id)}
                  className="text-blue-400 text-xs mt-1"
                >
                  {expandedDescriptions.has(activePlace.id) ? 'Read less' : 'Read more'}
                </button>
              )}
            </div>
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
          
          {/* Add ArtifactsNearby component */}
          <ArtifactsNearby 
            activePlace={activePlace} 
            distanceSetting={distanceSetting} 
            shops={artisans}
          />


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
                  {/* Add to Tour Plan Button for Hotels */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToTourPlan({
                        id: h.id,
                        name: h.name,
                        category: 'Hotel' as PlaceCategory,
                        lat: h.lat,
                        lon: h.lon
                      });
                    }}
                    className="mt-1 bg-blue-500 text-white px-2 py-1 rounded text-xs self-start"
                  >
                    Add to Tour Plan
                  </button>
                </a>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}