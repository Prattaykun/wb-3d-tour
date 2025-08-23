"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Filter, Star, Calendar, Users, Mountain, Coffee } from "lucide-react"

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
    image: "/tiger-hill-kanchenjunga-sunrise.png",
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
    image: "/darjeeling-tea-pickers.png",
    description:
      "Explore the world-famous tea estates and learn about the tea-making process while enjoying scenic mountain views.",
    rating: 4.7,
    price: "₹300 per person",
    duration: "Full day",
    category: "Heritage",
    highlights: ["Tea Tasting", "Plantation Tour", "Mountain Views"],
  },
  // ... (keep the rest same)
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Mountain className="h-8 w-8 text-primary" />
                Explore Darjeeling District
              </h1>
              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                Discover the Queen of Hills - Tea Gardens, Himalayan Views & Cultural Heritage
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-sm text-muted-foreground">
                {selectedDestinations.length} destination{selectedDestinations.length !== 1 ? "s" : ""} selected
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-xs">{destination.rating}</span>
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{destination.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {destination.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{destination.price}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {destination.duration}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{destination.description}</p>

                <Button
                  onClick={() => toggleDestination(destination.id)}
                  variant={selectedDestinations.includes(destination.id) ? "default" : "outline"}
                  className="w-full"
                >
                  {selectedDestinations.includes(destination.id) ? "Selected" : "Add to Itinerary"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Destinations Summary */}
        {selectedDestinations.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Darjeeling Itinerary ({selectedDestinations.length} destinations)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button size="lg" className="flex-1">
                  Create Darjeeling Tour Plan
                </Button>
                <Button variant="outline" size="lg" onClick={() => setSelectedDestinations([])}>
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}