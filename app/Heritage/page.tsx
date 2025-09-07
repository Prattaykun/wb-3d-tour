"use client";

import React, { useState } from "react";
import { MapPin, Clock, Star, Camera, Info, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

import HeritageCard from "../../components/heritage/HeritageCard";
import HeritageFilter from "../../components/heritage/HeritageFilter";

export default function Heritage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();

  const heritageSites = [
    {
      id: 1,
      name: "Victoria Memorial",
      location: "Kolkata",
      category: "monument",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
      description:
        "Magnificent white marble monument built in memory of Queen Victoria, showcasing Indo-Saracenic architecture",
      established: "1921",
      visitDuration: "2-3 hours",
      rating: 4.8,
      highlights: [
        "Museum",
        "Gardens",
        "Art Gallery",
        "Light & Sound Show",
      ],
      bestTime: "October to March",
      entryFee: "₹30 for Indians, ₹500 for Foreigners",
    },
    {
      id: 2,
      name: "Dakshineswar Kali Temple",
      location: "Kolkata",
      category: "temple",
      image:
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
      description:
        "Sacred Hindu temple dedicated to Goddess Kali, associated with Sri Ramakrishna Paramahamsa",
      established: "1855",
      visitDuration: "1-2 hours",
      rating: 4.7,
      highlights: [
        "Main Temple",
        "Ramakrishna's Room",
        "River Ganga",
        "Aarti Ceremonies",
      ],
      bestTime: "Early morning or evening",
      entryFee: "Free",
    },
    {
      id: 3,
      name: "Howrah Bridge",
      location: "Kolkata",
      category: "architecture",
      image:
        "https://images.unsplash.com/photo-1555400082-4b3b94d6d721?w=600&q=80",
      description:
        "Iconic cantilever bridge over Hooghly River, engineering marvel and symbol of Kolkata",
      established: "1943",
      visitDuration: "1 hour",
      rating: 4.6,
      highlights: [
        "Bridge Walk",
        "River Views",
        "Photography",
        "Evening Lights",
      ],
      bestTime: "Sunset for best views",
      entryFee: "Free",
    },
    {
      id: 4,
      name: "Belur Math",
      location: "Howrah",
      category: "temple",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
      description:
        "Headquarters of Ramakrishna Mission, architectural synthesis of Hindu, Islamic and Christian motifs",
      established: "1897",
      visitDuration: "2 hours",
      rating: 4.8,
      highlights: ["Main Temple", "Museum", "Meditation Hall", "Ganga Aarti"],
      bestTime: "Morning and evening",
      entryFee: "Free",
    },
    {
      id: 5,
      name: "Cooch Behar Palace",
      location: "Cooch Behar",
      category: "palace",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
      description:
        "Elegant palace built in classical European style, former residence of Cooch Behar royal family",
      established: "1887",
      visitDuration: "2-3 hours",
      rating: 4.5,
      highlights: ["Royal Chambers", "Durbar Hall", "Trophy Gallery", "Gardens"],
      bestTime: "October to March",
      entryFee: "₹15 for Indians, ₹200 for Foreigners",
    },
    {
      id: 6,
      name: "Hazarduari Palace",
      location: "Murshidabad",
      category: "palace",
      image:
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
      description:
        "Palace of Thousand Doors, showcasing the grandeur of Nawabs of Bengal",
      established: "1837",
      visitDuration: "2-3 hours",
      rating: 4.6,
      highlights: [
        "Thousand Doors",
        "Mirror Hall",
        "Armoury",
        "Portrait Gallery",
      ],
      bestTime: "October to March",
      entryFee: "₹20 for Indians, ₹300 for Foreigners",
    },
  ];

  const filteredSites =
    activeFilter === "all"
      ? heritageSites
      : heritageSites.filter((site) => site.category === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 transition-all duration-700 ease-in-out">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Heritage <span className="text-indigo-600">Sites</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8">
            Explore West Bengal&apos;s magnificent heritage sites that tell the
            story of centuries of cultural evolution, architectural brilliance,
            and spiritual significance
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl p-6 shadow-lg max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">50+</div>
              <div className="text-gray-600 font-medium">Heritage Sites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">
                800+
              </div>
              <div className="text-gray-600 font-medium">Years of History</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">15</div>
              <div className="text-gray-600 font-medium">UNESCO Sites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">
                25+
              </div>
              <div className="text-gray-600 font-medium">
                Architectural Styles
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <HeritageFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* Heritage Sites Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
          {filteredSites.map((site, index) => (
            <HeritageCard key={site.id} site={site} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white transition-all duration-700 ease-in-out hover:shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Plan Your Heritage Journey
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Let us help you create an unforgettable experience exploring West
            Bengal&apos;s rich heritage
          </p>
          
          <button
           
          className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105" onClick={() => router.push("/MyTourPlan")} >
            Get Personalized Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
