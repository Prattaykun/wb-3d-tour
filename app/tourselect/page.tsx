"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Star, Calendar, Users, Mountain, Coffee } from "lucide-react"
import BottomNav from "@/components/BottomNav"

interface Destination {
  id: string
  name: string
  location: string
  image: string
  description: string
  rating: number
  price: string
  duration: string
  category: string
  highlights: string[]
}

const destinations: Destination[] = [
   {
    id: "1",
    name: "Tiger Hill",
    location: "Darjeeling Town",
    image: "/media/tiger-hill-sunrise.png",
    description:
      "Witness the spectacular sunrise over Mount Kanchenjunga and the Himalayan range from this famous viewpoint.",
    rating: 4.8,
    price: "₹500 per person",
    duration: "Half day",
    category: "Scenic",
    highlights: ["Sunrise Views", "Kanchenjunga", "Photography"],
  },
  {
    id: "2",
    name: "Darjeeling Tea Gardens",
    location: "Happy Valley & Glenburn",
    image: "/media/darjeeling/teagarden.avif",
    description:
      "Explore the world-famous tea estates and learn about the tea-making process while enjoying scenic mountain views.",
    rating: 4.7,
    price: "₹300 per person",
    duration: "Full day",
    category: "Heritage",
    highlights: ["Tea Tasting", "Plantation Tour", "Mountain Views"],
  },
  {
    id: "3",
    name: "Toy Train (DHR)",
    location: "New Jalpaiguri to Darjeeling",
    image: "/media/darjeeling/hq720.jpg",
    description:
      "Experience the UNESCO World Heritage Darjeeling Himalayan Railway through breathtaking mountain landscapes.",
    rating: 4.9,
    price: "₹1,200 per person",
    duration: "8 hours",
    category: "Heritage",
    highlights: ["UNESCO Heritage", "Mountain Railway", "Scenic Journey"],
  },
  {
    id: "4",
    name: "Sandakphu Trek",
    location: "Singalila National Park",
    image: "/media/darjeeling/sandakphu.jpg",
    description: "Trek to the highest peak in West Bengal with stunning views of Everest, Kanchenjunga, and Makalu.",
    rating: 4.6,
    price: "₹8,000 per person",
    duration: "4-5 days",
    category: "Adventure",
    highlights: ["Everest Views", "High Altitude Trek", "Rhododendrons"],
  },
  {
    id: "5",
    name: "Kalimpong",
    location: "Kalimpong Town",
    image: "/media/darjeeling/Kalingpong.jpeg",
    description:
      "Visit this charming hill station known for its monasteries, flower nurseries, and panoramic valley views.",
    rating: 4.5,
    price: "₹2,500 per person",
    duration: "2 days",
    category: "Cultural",
    highlights: ["Monasteries", "Flower Markets", "Valley Views"],
  },
  {
    id: "6",
    name: "Mirik Lake",
    location: "Mirik",
    image: "/media/darjeeling/Mrik-Landscape.jpg",
    description: "Enjoy boating and peaceful walks around this beautiful artificial lake surrounded by pine forests.",
    rating: 4.4,
    price: "₹1,500 per person",
    duration: "Full day",
    category: "Scenic",
    highlights: ["Lake Boating", "Pine Forests", "Peaceful Walks"],
  },
  {
    id: "7",
    name: "Ghum Monastery",
    location: "Ghum",
    image: "/media/darjeeling/Ghum.jpg",
    description:
      "Visit the famous Yiga Choeling Monastery, one of the oldest Tibetan Buddhist monasteries in the region.",
    rating: 4.3,
    price: "₹200 per person",
    duration: "2-3 hours",
    category: "Cultural",
    highlights: ["Buddhist Culture", "Prayer Wheels", "Mountain Views"],
  },
  {
    id: "8",
    name: "Kurseong",
    location: "Kurseong Town",
    image: "/media/darjeeling/kurseong.jpg",
    description: "Explore the 'Land of White Orchids' with its misty hills, tea gardens, and colonial architecture.",
    rating: 4.2,
    price: "₹2,000 per person",
    duration: "2 days",
    category: "Heritage",
    highlights: ["White Orchids", "Colonial Architecture", "Tea Gardens"],
  },
]

export default function TourPlanPage() {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([])

  const toggleDestination = (destinationId: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(destinationId)
        ? prev.filter((id) => id !== destinationId)
        : [...prev, destinationId],
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              <Mountain className="h-8 w-8 text-purple-500" />
              Explore Mountains Of WestBengal
            </h1>
            <p className="text-gray-500 mt-2 flex items-center gap-2">
              <Coffee className="h-4 w-4 text-amber-500" />
              Discover the Queen of Hills - Tea Gardens, Himalayan Views & Cultural Heritage
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl shadow-inner">
            <MapPin className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              {selectedDestinations.length} destination{selectedDestinations.length !== 1 ? "s" : ""} selected
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="overflow-hidden border-0 rounded-2xl shadow-md hover:shadow-xl transition-all bg-white/90 backdrop-blur">
                <div className="relative">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-52 object-cover rounded-t-2xl"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    <Star className="h-4 w-4 text-yellow-400" />
                    {destination.rating}
                  </div>
                </div>

               <CardHeader>
  <div className="flex justify-between items-start">
    <div>
      {/* Darker place name */}
      <CardTitle className="text-lg font-bold text-gray-900">
        {destination.name}
      </CardTitle>
      <CardDescription className="flex items-center gap-1 text-gray-500">
        <MapPin className="h-3 w-3 text-pink-500" />
        {destination.location}
      </CardDescription>
    </div>
    <div className="text-right">
      <p className="font-semibold text-purple-600">{destination.price}</p>
      <p className="text-xs text-gray-400 flex items-center gap-1">
        <Calendar className="h-3 w-3 text-indigo-400" />
        {destination.duration}
      </p>
    </div>
  </div>
</CardHeader>

<CardContent>
  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{destination.description}</p>

  <Button
    onClick={() => toggleDestination(destination.id)}
    variant={selectedDestinations.includes(destination.id) ? "default" : "outline"}
    className={`w-full py-2 rounded-xl transition ${
      selectedDestinations.includes(destination.id)
        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
        : "border-gray-300 text-gray-800 hover:border-purple-400 hover:text-purple-700"
    }`}
  >
    {selectedDestinations.includes(destination.id) ? "✓ Selected" : "Add to Itinerary"}
  </Button>
</CardContent>

              </Card>
            </motion.div>
          ))}
        </div>

        {/* Itinerary */}
        {selectedDestinations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-100 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-purple-700">
                  <Users className="h-5 w-5 text-purple-500" />
                  Your Mountains Itinerary ({selectedDestinations.length} destinations)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-lg hover:scale-[1.02] transition"
                  >
                    Create Tour Plan
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setSelectedDestinations([])}
                    className="rounded-xl border-purple-400 text-purple-600 hover:bg-purple-50"
                  >
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
    
  )
}
