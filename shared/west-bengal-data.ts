// /shared/west-bengal-data.ts
import { PlaceSpec, Hotel } from "./types";

// ===== All Places in West Bengal =====
export const PLACES: PlaceSpec[] = [
  // ===== Kolkata =====
  {
    id: "dumdum-airport",
    name: "Netaji Subhas Chandra Bose International Airport",
    category: "Transport",
    lat: 22.6547,
    lon: 88.4467,
    city: "Kolkata",
    images: ["/media/dumdum-airport.jpg", "/media/dumdum-airport-1.jpg"],
    description:
      "Major international airport serving Kolkata and Eastern India, named after freedom fighter Netaji Subhas Chandra Bose.",
    tips: ["Arrive 2 hours before departure", "Metro and taxi available for city transit"],
    entryFeeINR: "Depends on airline",
    hours: "24 hours",
  },
  
  {
    id: "victoria-memorial",
    name: "Victoria Memorial",
    category: "Heritage",
    lat: 22.5448,
    lon: 88.3426,
    city: "Kolkata",
    images: ["/media/victoria.webp", "/media/victoria-memorial-kolkata.png"],
    description:
      "Iconic marble museum and gardens dedicated to Queen Victoria; blend of British and Mughal elements.",
    tips: ["Best light at golden hour", "Closed Mondays"],
    entryFeeINR: 30,
    hours: "10:00–17:00",
  },
  {
    id: "dakshineswar-temple",
    name: "Dakshineswar Kali Temple",
    category: "Temple",
    lat: 22.6556,
    lon: 88.357,
    city: "Kolkata",
    images: ["/media/dakhineswar.jpg"],
    description:
      "19th-century riverside temple complex dedicated to Goddess Kali on the Hooghly.",
    tips: ["Dress modestly", "Early mornings less crowded"],
    entryFeeINR: "Free",
    hours: "06:00–12:30, 15:00–20:30",
  },

  // ===== Sundarbans =====
  {
    id: "sundarbans",
    name: "Sundarbans Mangroves",
    category: "Nature",
    lat: 21.9497,
    lon: 88.833,
    city: "South 24 Parganas",
    images: ["/media/sundarbans.webp", "/media/sundarbans-tigers.png"],
    description:
      "World’s largest mangrove forest and Royal Bengal Tiger habitat; boat safaris via Gosaba, Godkhali.",
    tips: ["Permits required", "Best Nov–Feb"],
    entryFeeINR: 100,
    hours: "Permits/boat timings",
  },

  // ===== Alipurduar =====
  {
    id: 'jayanti',
    name: 'Jayanti',
    category: 'Nature',
    lat: 26.6172,
    lon: 89.6013,
    city: 'Jayanti',
    images: ['/media/Alipurduar District/Jayant-Riverbed.jpg'],
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
    images: [
      '/media/Alipurduar District/chiltapara.jpg',
      '/media/Alipurduar District/Chilapata.jpg',
      '/media/Alipurduar District/River-Beside-Chilapata-Jungle-Camp.jpg'
    ],
    description: 'Dense forest corridor between Buxa and Jaldapara, home to elephants, rhinos, leopards, and rare orchids.',
    tips: ['Wildlife safari from Mendabari watchtower', 'Best Nov–Mar'],
    entryFeeINR: 100,
    hours: '06:00–17:00'
  },
  {
    id: 'raimatang',
    name: 'Raimatang',
    category: 'Village',
    lat: 26.766079,
    lon: 89.503765,
    city: 'Raimatang',
    images: [
      '/media/Alipurduar District/raim.jpg',
      '/media/Alipurduar District/rai.jpg',
      '/media/Alipurduar District/1Raimatang.jpg',
      '/media/Alipurduar District/raimatang_1.webp'
    ],
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
    images: [
      '/media/Alipurduar District/jai.jpg',
      '/media/Alipurduar District/jaigaon.jpg'
    ],
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
    images: [
      '/media/Alipurduar District/toto.jpg',
      '/media/Alipurduar District/toto-para.webp'
    ],
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
    images: [
      '/media/Alipurduar District/Rajabhat.jpg',
      '/media/Alipurduar District/Rajabhatkhawa.jpg'
    ],
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
    images: [
      '/media/Alipurduar District/Buxa.jpg',
      '/media/Alipurduar District/Buxa.webp'
    ],
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
    images: [
      '/media/Alipurduar District/jaldapara-wildlife.jpg',
      '/media/Alipurduar District/Jaldpara-Tourism.jpg'
    ],
    description: 'National park famous for Indian one-horned rhinos, elephants, and Bengal florican.',
    tips: ['Book elephant safari early', 'Excellent for birdwatching'],
    entryFeeINR: 100,
    hours: '06:00–17:00'
  },


  // ===== Bankura =====
  {
    id: "bishnupur-terracotta",
    name: "Bishnupur Terracotta Temples",
    category: "Heritage",
    lat: 23.0737,
    lon: 87.3216,
    city: "Bishnupur",
    images: ["/media/Bankura/bishnupur-terracotta.jpg"],
    description: "Famed terracotta temples (17th–18th c.) with intricate panels depicting epics and local life.",
    tips: ["Hire a local guide", "Carry water, summers are hot"],
    entryFeeINR: 50,
    hours: "Sunrise–Sunset",
  },
  {
    id: "susunia-hill",
    name: "Susunia Hill",
    category: "Nature",
    lat: 23.3755,
    lon: 86.9867,
    city: "Bankura",
    images: ["/media/Bankura/susunia-hill.jpg"],
    description: "A hill famous for rock climbing, trekking, natural springs, and ancient fossils.",
    tips: ["Carry trekking shoes", "Avoid monsoon season"],
    entryFeeINR: "Free",
    hours: "Open all day",
  },
  {
    id: "joyrambati",
    name: "Joyrambati",
    category: "Pilgrimage",
    lat: 23.4335,
    lon: 87.3219,
    city: "Bankura",
    images: ["/media/Bankura/joyrambati.jpg"],
    description: "Birthplace of Holy Mother Sarada Devi, with serene temple surroundings.",
    tips: ["Maintain silence inside temple", "Best in morning hours"],
    entryFeeINR: "Free",
    hours: "05:00–20:00",
  },
  {
    id: "kangsabati-dam",
    name: "Kangsabati Dam",
    category: "Nature",
    lat: 23.1856,
    lon: 86.6161,
    city: "Bankura",
    images: ["/media/Bankura/kangsabati-dam.jpg"],
    description: "Scenic reservoir surrounded by hills, ideal for picnics, photography, and sunset views.",
    tips: ["Evening views are best", "Avoid monsoon for safety"],
    entryFeeINR: "Free",
    hours: "Open all day",
  },
  {
    id: "garh-panchkot",
    name: "Garh Panchkot",
    category: "Heritage",
    lat: 23.55,
    lon: 86.8,
    city: "Bankura",
    images: ["/media/Bankura/garh-panchkot.jpg"],
    description: "Ruins of the 16th-century fort of the Panchkot kings, set amidst picturesque hills.",
    tips: ["Good for photography", "Combine visit with Panchet Dam"],
    entryFeeINR: "Free",
    hours: "Open all day",
  },
  {
    id: "jhilimili",
    name: "Jhilimili",
    category: "Nature",
    lat: 22.95,
    lon: 86.87,
    city: "Bankura",
    images: ["/media/Bankura/jhilimili.jpg"],
    description: "A forested hill area known as the 'Darjeeling of Bankura', perfect for nature lovers.",
    tips: ["Best during winter", "Carry water and snacks"],
    entryFeeINR: "Free",
    hours: "Open all day",
  },
  

  // ===== Darjeeling =====
  {
    id: "tiger-hill",
    name: "Tiger Hill",
    category: "Nature",
    lat: 27.029,
    lon: 88.2655,
    city: "Darjeeling",
    images: ["/media/tiger-hill-sunrise.png"],
    description:
      "Famous sunrise viewpoint offering a panoramic view of Mount Kanchenjunga and Everest on clear days.",
    tips: ["Arrive early before sunrise", "Carry warm clothes"],
    entryFeeINR: "Free",
    hours: "04:00–18:00",
  },
  {
    id: "batasia-loop",
    name: "Batasia Loop",
    category: "Heritage",
    lat: 27.0165,
    lon: 88.2622,
    city: "Darjeeling",
    images: [
      "/media/Darjeeling-toy-train-in-Batasia-loop.jpg",
      "/media/bata.webp",
    ],
    description:
      "Iconic spiral railway loop with a war memorial and gardens, part of the UNESCO Darjeeling Himalayan Railway.",
    tips: ["Best when toy train passes", "Great photography spot"],
    entryFeeINR: 20,
    hours: "Sunrise–Sunset",
  },

  // ===== Digha =====
  {
    id: "new-digha-beach",
    name: "New Digha Beach",
    category: "Beach",
    lat: 21.6266,
    lon: 87.5183,
    city: "Digha",
    images: ["/media/digha/digha-beach-bay-of-bengal.png"],
    description:
      "Popular beach destination in West Bengal with wide sandy shores, sunrise views, and seafood stalls.",
    tips: ["Avoid weekends for less crowd", "Best early morning"],
    entryFeeINR: "Free",
    hours: "Open all day",
  },

  // ===== Shantiniketan =====
  {
    id: "visva-bharati",
    name: "Visva-Bharati University",
    category: "Heritage",
    lat: 23.6776,
    lon: 87.686,
    city: "Shantiniketan",
    images: ["/media/shantiniketan-university.png", "/media/santi.png"],
    description:
      "Founded by Rabindranath Tagore, it is a center of culture, arts, and education with historic significance.",
    tips: ["Check seasonal festivals", "Explore Tagore’s ashram nearby"],
    entryFeeINR: 30,
    hours: "10:00–17:00",
  },
];

// ===== All Hotels in West Bengal =====
export const HOTELS: Hotel[] = [
  // Kolkata
  {
    id: "taj-bengal",
    name: "Taj Bengal",
    lat: 22.5404,
    lon: 88.345,
    rating: 4.7,
    priceBand: "Premium",
    nearPlaceId: "victoria-memorial",
    city: "Kolkata",
  },
  {
    id: "park-kolkata",
    name: "The Park Kolkata",
    lat: 22.5535,
    lon: 88.3528,
    rating: 4.3,
    priceBand: "Mid",
    nearPlaceId: "victoria-memorial",
    city: "Kolkata",
  },

  // Sundarbans (none yet)

  // Alipurduar
  {
    id: 'jayanti-resort',
    name: 'Jayanti River View Lodge',
    lat: 26.6165,
    lon: 89.6001,
    rating: 4.1,
    priceBand: 'Budget',
    nearPlaceId: 'jayanti',
    city: 'Jayanti'
  },
  {
    id: 'chilapata-lodge',
    name: 'Mendabari Jungle Camp',
    lat: 26.5790,
    lon: 89.4040,
    rating: 4.4,
    priceBand: 'Mid',
    nearPlaceId: 'chilapata',
    city: 'Chilapata'
  },
  {
    id: 'raimatang-eco',
    name: 'Raimatang Eco Stay',
    lat: 26.6125,
    lon: 89.6730,
    rating: 4.0,
    priceBand: 'Budget',
    nearPlaceId: 'raimatang',
    city: 'Raimatang'
  },
  {
    id: 'jaigaon-inn',
    name: 'Hotel Druk Jaigaon',
    lat: 26.8465,
    lon: 89.3742,
    rating: 4.2,
    priceBand: 'Mid',
    nearPlaceId: 'jaigaon',
    city: 'Jaigaon'
  },
  {
    id: 'totopara-camp',
    name: 'Totopara Tribal Homestay',
    lat: 26.8335,
    lon: 89.3635,
    rating: 4.3,
    priceBand: 'Budget',
    nearPlaceId: 'totopara',
    city: 'Totopara'
  },
  {
    id: 'rajabhatkhawa-hotel',
    name: 'Rajabhatkhawa Forest Lodge',
    lat: 26.6150,
    lon: 89.5470,
    rating: 4.1,
    priceBand: 'Budget',
    nearPlaceId: 'rajabhatkhawa',
    city: 'Rajabhatkhawa'
  },
  {
    id: 'buxa-lodge',
    name: 'Buxa Jungle Lodge',
    lat: 26.6280,
    lon: 89.5650,
    rating: 4.5,
    priceBand: 'Mid',
    nearPlaceId: 'buxa-tiger-reserve',
    city: 'Buxa'
  },
  {
    id: 'jaldapara-safari',
    name: 'Jaldapara Safari Lodge',
    lat: 26.6890,
    lon: 89.2770,
    rating: 4.6,
    priceBand: 'Premium',
    nearPlaceId: 'jaldapara',
    city: 'Madarihat'
  },

  // Bankura
  {
    id: 'green-palace-guest',
    name: 'Green Palace Guest House',
    lat: 23.2375,
    lon: 87.0719,
    rating: 4.8,
    priceBand: 'Budget',
    nearPlaceId: 'susunia-hill',
    city: 'Bankura'
  },
  {
    id: 'maa-laxmi-lodge',
    name: 'Hotel O Maa Laxmi Lodge',
    lat: 23.2324,
    lon: 87.0782,
    rating: 3.4,
    priceBand: 'Budget',
    nearPlaceId: 'susunia-hill',
    city: 'Bankura'
  },
  {
    id: 'anticlock-resort',
    name: 'Anticlock Suites & Resort',
    lat: 23.2850,
    lon: 87.0610,
    rating: 4.5,
    priceBand: 'Premium',
    nearPlaceId: 'susunia-hill',
    city: 'Bankura'
  },
  {
    id: 'hotel-olivia',
    name: 'Hotel Olivia and Resort',
    lat: 23.0659,
    lon: 87.3214,
    rating: 3.7,
    priceBand: 'Mid',
    nearPlaceId: 'bishnupur-terracotta',
    city: 'Bishnupur'
  },
  {
    id: 'hotel-annapurna',
    name: 'Hotel Annapurna Bishnupur',
    lat: 23.0732,
    lon: 87.3220,
    rating: 4.0,
    priceBand: 'Budget',
    nearPlaceId: 'bishnupur-terracotta',
    city: 'Bishnupur'
  },
  {
    id: 'monalisa-lodge',
    name: 'Monalisa Lodge Bishnupur',
    lat: 23.0739,
    lon: 87.3232,
    rating: 3.9,
    priceBand: 'Budget',
    nearPlaceId: 'bishnupur-terracotta',
    city: 'Bishnupur'
  },
  {
    id: 'sonar-bangla-joypur',
    name: 'Hotel Sonar Bangla Joypur Forest',
    lat: 23.0545,
    lon: 87.3060,
    rating: 4.2,
    priceBand: 'Mid',
    nearPlaceId: 'bishnupur-terracotta',
    city: 'Bishnupur'
  },
  {
    id: "bishnupur-guest",
    name: "Bishnupur Heritage Stay",
    lat: 23.072,
    lon: 87.324,
    rating: 4.2,
    priceBand: "Budget",
    nearPlaceId: "bishnupur-terracotta",
    city: "Bishnupur"
  },

  // Darjeeling
  {
    id: "mayfair-darjeeling",
    name: "Mayfair Darjeeling",
    lat: 27.0418,
    lon: 88.2627,
    rating: 4.6,
    priceBand: "Premium",
    nearPlaceId: "tiger-hill",
    city: "Darjeeling",
  },

  // Digha
  {
    id: "sea-hawk-digha",
    name: "Hotel Sea Hawk",
    lat: 21.627,
    lon: 87.519,
    rating: 4.2,
    priceBand: "Mid",
    nearPlaceId: "new-digha-beach",
    city: "Digha",
  },

  // Shantiniketan
  {
    id: "camellia-resort",
    name: "Camellia Resort Shantiniketan",
    lat: 23.678,
    lon: 87.689,
    rating: 4.3,
    priceBand: "Mid",
    nearPlaceId: "visva-bharati",
    city: "Shantiniketan",
  },
  
];