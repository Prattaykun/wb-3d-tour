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
    images: ['https://images.unsplash.com/photo-1583311544843-6f03ba0dfb68'],
    description: 'Iconic marble museum and gardens dedicated to Queen Victoria; blend of British and Mughal elements.',
    tips: ['Best light at golden hour', 'Closed Mondays'],
    entryFeeINR: 30,
    hours: '10:00–17:00',
  },
  {
    id: 'dakshineswar-temple',
    name: 'Dakshineswar Kali Temple',
    category: 'Temple',
    lat: 22.6556,
    lon: 88.3570,
    city: 'Kolkata',
    images: ['https://images.unsplash.com/photo-1595059225291-61e7d05f7b22'],
    description: '19th-century riverside temple complex dedicated to Goddess Kali on the Hooghly.',
    tips: ['Dress modestly', 'Early mornings less crowded'],
    entryFeeINR: 'Free',
    hours: '06:00–12:30, 15:00–20:30',
  },
  // Add the rest...
];

export const HOTELS: Hotel[] = [
  {
    id: 'taj-bengal',
    name: 'Taj Bengal',
    lat: 22.5404,
    lon: 88.3450,
    rating: 4.7,
    priceBand: 'Premium',
    nearPlaceId: 'victoria-memorial',
  },
  {
    id: 'park-kolkata',
    name: 'The Park Kolkata',
    lat: 22.5535,
    lon: 88.3528,
    rating: 4.3,
    priceBand: 'Mid',
    nearPlaceId: 'victoria-memorial',
  },
  // etc...
];
