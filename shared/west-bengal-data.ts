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
    images: ['/media/victoria.webp'],
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
    images: ['/media/dakhineswar.jpg'],
    description: '19th-century riverside temple complex dedicated to Goddess Kali on the Hooghly.',
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
    images: ['/media/bishnupur-terracotta.jpg'],
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
    images: ['/media/sundarbans.webp'],
    description: 'World’s largest mangrove forest and Royal Bengal Tiger habitat; boat safaris via Gosaba, Godkhali.',
    tips: ['Permits required', 'Best Nov–Feb'],
    entryFeeINR: 100,
    hours: 'Permits/boat timings'
  },
  // ===== Alipurduar Places (with correct city names) =====
{
  id: 'jayanti',
  name: 'Jayanti',
  category: 'Nature',
  lat: 26.6172,
  lon: 89.6013,
  city: 'Jayanti',
  images: ['/media/Jayant-Riverbed.jpg'],
  description: 'A serene riverside spot along the Jayanti River bordering Bhutan hills, rich in wildlife and scenic beauty.',
  tips: ['Visit Jayanti Mahakal Cave', 'Carry binoculars for birdwatching'],
  entryFeeINR: 'Free',
  hours: 'Open all day'
},
{
  id: 'chilapata',
  name: 'Chilapata Wildlife Sanctuary',
  category: 'Wildlife',
  lat: 26.5775,
  lon: 89.4021,
  city: 'Chilapata',
  images: [''],
  description: 'Dense forest corridor between Buxa and Jaldapara, home to elephants, rhinos, leopards, and rare orchids.',
  tips: ['Wildlife safari from Mendabari watchtower', 'Best Nov–Mar'],
  entryFeeINR: 100,
  hours: '06:00–17:00'
},
{
  id: 'raimatang',
  name: 'Raimatang',
  category: 'Village',
  lat: 26.6136,
  lon: 89.6748,
  city: 'Raimatang',
  images: [''],
  description: 'A riverside village in Buxa Reserve, known for treks, forest beauty, and rock climbing opportunities.',
  tips: ['Great base for Adma trek', 'Minimal tourist facilities—plan ahead'],
  entryFeeINR: 'Free',
  hours: 'Open all day'
},
{
  id: 'jaigaon',
  name: 'Jaigaon',
  category: 'Town',
  lat: 26.8470,
  lon: 89.3755,
  city: 'Jaigaon',
  images: [''],
  description: 'Border town at Bhutan’s Phuentsholing gate, buzzing with trade and cultural exchanges.',
  tips: ['Great for cross-border shopping', 'Try local Bhutanese food nearby'],
  entryFeeINR: 'Free',
  hours: 'Open all day'
},
{
  id: 'totopara',
  name: 'Totopara',
  category: 'Village',
  lat: 26.8342,
  lon: 89.3627,
  city: 'Totopara',
  images: [''],
  description: 'Home of the unique Toto tribe with distinct culture and traditions, preserved over centuries.',
  tips: ['Respect local customs', 'Engage with local handicrafts'],
  entryFeeINR: 'Free',
  hours: 'Open all day'
},
{
  id: 'rajabhatkhawa',
  name: 'Rajabhatkhawa',
  category: 'Nature',
  lat: 26.6166,
  lon: 89.5483,
  city: 'Rajabhatkhawa',
  images: [''],
  description: 'Gateway town to Buxa Tiger Reserve, known for birdwatching, trekking, and safari permits.',
  tips: ['Carry ID for permits', 'Wildlife sightings best in early morning'],
  entryFeeINR: 'Permit charges apply',
  hours: '06:00–17:00'
},
{
  id: 'buxa-tiger-reserve',
  name: 'Buxa Tiger Reserve',
  category: 'Wildlife',
  lat: 26.6276,
  lon: 89.5661,
  city: 'Buxa',
  images: [''],
  description: '760 sq km reserve rich in biodiversity—tigers, elephants, leopards, and rare birds.',
  tips: ['Safari bookings in advance', 'Best Nov–Mar'],
  entryFeeINR: 150,
  hours: '06:00–17:00'
},
{
  id: 'jaldapara',
  name: 'Jaldapara National Park',
  category: 'Wildlife',
  lat: 26.6882,
  lon: 89.2755,
  city: 'Madarihat',
  images: ['/media/jaldapara-wildlife.jpg','/media/Jaldpara-Tourism.jpg'],
  description: 'National park famous for Indian one-horned rhinos, elephants, and Bengal florican.',
  tips: ['Book elephant safari early', 'Excellent for birdwatching'],
  entryFeeINR: 100,
  hours: '06:00–17:00'
}

];

export const HOTELS: Hotel[] = [
  { id: 'taj-bengal', name: 'Taj Bengal', lat: 22.5404, lon: 88.3450, rating: 4.7, priceBand: 'Premium', nearPlaceId: 'victoria-memorial' },
  { id: 'park-kolkata', name: 'The Park Kolkata', lat: 22.5535, lon: 88.3528, rating: 4.3, priceBand: 'Mid', nearPlaceId: 'victoria-memorial' },
  { id: 'bishnupur-guest', name: 'Bishnupur Heritage Stay', lat: 23.0720, lon: 87.3240, rating: 4.2, priceBand: 'Budget', nearPlaceId: 'bishnupur-terracotta' },

  // ===== Alipurduar Hotels (city names corrected) =====
  { id: 'jayanti-resort', name: 'Jayanti River View Lodge', lat: 26.6165, lon: 89.6001, rating: 4.1, priceBand: 'Budget', nearPlaceId: 'jayanti', city: 'Jayanti' },
  { id: 'chilapata-lodge', name: 'Mendabari Jungle Camp', lat: 26.5790, lon: 89.4040, rating: 4.4, priceBand: 'Mid', nearPlaceId: 'chilapata', city: 'Chilapata' },
  { id: 'raimatang-eco', name: 'Raimatang Eco Stay', lat: 26.6125, lon: 89.6730, rating: 4.0, priceBand: 'Budget', nearPlaceId: 'raimatang', city: 'Raimatang' },
  { id: 'jaigaon-inn', name: 'Hotel Druk Jaigaon', lat: 26.8465, lon: 89.3742, rating: 4.2, priceBand: 'Mid', nearPlaceId: 'jaigaon', city: 'Jaigaon' },
  { id: 'totopara-camp', name: 'Totopara Tribal Homestay', lat: 26.8335, lon: 89.3635, rating: 4.3, priceBand: 'Budget', nearPlaceId: 'totopara', city: 'Totopara' },
  { id: 'rajabhatkhawa-hotel', name: 'Rajabhatkhawa Forest Lodge', lat: 26.6150, lon: 89.5470, rating: 4.1, priceBand: 'Budget', nearPlaceId: 'rajabhatkhawa', city: 'Rajabhatkhawa' },
  { id: 'buxa-lodge', name: 'Buxa Jungle Lodge', lat: 26.6280, lon: 89.5650, rating: 4.5, priceBand: 'Mid', nearPlaceId: 'buxa-tiger-reserve', city: 'Buxa' },
  { id: 'jaldapara-safari', name: 'Jaldapara Safari Lodge', lat: 26.6890, lon: 89.2770, rating: 4.6, priceBand: 'Premium', nearPlaceId: 'jaldapara', city: 'Madarihat' }
];



