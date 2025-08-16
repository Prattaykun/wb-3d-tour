// /shared/west-bengal-data.ts



import { PlaceSpec, Hotel } from './types';

export const PLACES: PlaceSpec[] = [
  {
    id: 'victoria-memorial',
    name: 'Victoria Memorial',
    category: 'Heritage',
    lat: 22.5448,
    lon: 88.3426,
    city: 'Kolkata',
    images: ['/media/victoria.webp'],  // ✅ correct path
    description: 'Iconic marble museum and gardens dedicated to Queen Victoria; blend of British and Mughal elements.',
    tips: ['Best light at golden hour', 'Closed Mondays'],
    entryFeeINR: 30,
    hours: '10:00–17:00'
  },
  {
    id: 'dakshineswar-temple',
    name: 'Dakshineswar Kali Temple',
    category: 'Temple',
    lat: 22.6556,
    lon: 88.3570,
    city: 'Kolkata',
    images: ['/media/dakhineswar.jpg'],  // ✅ correct path
    description: '19th‑century riverside temple complex dedicated to Goddess Kali on the Hooghly.',
    tips: ['Dress modestly', 'Early mornings less crowded'],
    entryFeeINR: 'Free',
    hours: '06:00–12:30, 15:00–20:30'
  },
  {
    id: 'bishnupur-terracotta',
    name: 'Bishnupur Terracotta Temples',
    category: 'Heritage',
    lat: 23.0737,
    lon: 87.3216,
    city: 'Bishnupur',
    images: ['/media/bishnupur-terracotta.jpg'],  // ✅ correct path
    description: 'Famed terracotta temples (17th–18th c.) with intricate panels depicting epics and local life.',
    tips: ['Hire a local guide', 'Carry water, summers are hot'],
    entryFeeINR: 50,
    hours: 'Sunrise–Sunset'
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans Mangroves',
    category: 'Nature',
    lat: 21.9497,
    lon: 88.833,
    city: 'South 24 Parganas',
    images: ['media/sundarbans.webp'],  // ✅ correct path
    description: 'World’s largest mangrove forest and Royal Bengal Tiger habitat; boat safaris via Gosaba, Godkhali.',
    tips: ['Permits required', 'Best Nov–Feb'],
    entryFeeINR: 100,
    hours: 'Permits/boat timings'
  }
];

export const HOTELS: Hotel[] = [
  { id: 'taj-bengal', name: 'Taj Bengal', lat: 22.5404, lon: 88.3450, rating: 4.7, priceBand: 'Premium', nearPlaceId: 'victoria-memorial' },
  { id: 'park-kolkata', name: 'The Park Kolkata', lat: 22.5535, lon: 88.3528, rating: 4.3, priceBand: 'Mid', nearPlaceId: 'victoria-memorial' },
  { id: 'bishnupur-guest', name: 'Bishnupur Heritage Stay', lat: 23.0720, lon: 87.3240, rating: 4.2, priceBand: 'Budget', nearPlaceId: 'bishnupur-terracotta' }
];


