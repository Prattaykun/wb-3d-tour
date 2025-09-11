"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Camera, Heart, ArrowRight, Users, X, Search as SearchIcon } from "lucide-react";
import Search from "@/components/Search";
import HeroSection from "../components/home/HeroSection";
import FeaturedDestinations from "../components/home/FeaturedDestinations";
import CulturalHighlights from "../components/home/CulturalHighlights";
import TestimonialSection from "../components/home/TestimonialSection";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import Menu from "@/components/Menu";
import Chatbot from "@/components/Chatbot";

// Define the SearchResult interface for the home page
interface SearchResult {
  id: string;
  type: 'place' | 'hotel' | 'event' | 'artisan' | 'product';
  name: string;
  image: string | null;
  rating?: number;
  location?: string;
  description?: string;
  [key: string]: any;
}

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const router = useRouter();

  const heroImages = [
    "/media/m.webp",
    "/media/kolkata.jpg",
    "/media/pexels-aditya-chowdhury-1907990508-28938866.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const stats = [
    { icon: MapPin, label: "Heritage Sites", value: "50+" },
    { icon: Camera, label: "Photo Spots", value: "200+" },
    { icon: Heart, label: "Cultural Events", value: "100+" },
    { icon: Users, label: "Happy Visitors", value: "10K+" },
  ];

  const handleSearchResultSelect = (result: SearchResult) => {
    // Handle the search result selection
    console.log('Selected result:', result);
    
    // Navigate to the appropriate page based on the result type
    switch (result.type) {
      case 'place':
        router.push(`/places/${result.id}`);
        break;
      case 'hotel':
        router.push(`/hotels/${result.id}`);
        break;
      case 'event':
        router.push(`/events/${result.id}`);
        break;
      case 'artisan':
        router.push(`/artisans/${result.id}`);
        break;
      case 'product':
        router.push(`/products/${result.id}`);
        break;
      default:
        // For suggestions, navigate to a search results page
        router.push(`/search?q=${encodeURIComponent(result.name)}`);
    }
  };

  return (
    <>
      {/* Main Content */}
      <Menu />
      <HeroSection heroImages={heroImages} currentImageIndex={currentImageIndex} />

      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8 drop-shadow-sm">
            Find Your Perfect Experience
          </h2>

          <Search 
            placeholder="Discover places, hotels, events and more..."
            onResultSelect={handleSearchResultSelect}
            className="max-w-2xl mx-auto my-8"
          />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedDestinations />
      <CulturalHighlights />

      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Explore West Bengal?</h2>
            <p className="text-xl mb-8 opacity-90">Discover centuries of rich heritage, vibrant culture, and unforgettable experiences</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/MyTourPlan" className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center justify-center">
                Plan Your Trip <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/Heritage" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-all transform hover:scale-105 inline-flex items-center justify-center">
                Explore Heritage Sites <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TestimonialSection />

      {/* Floating Action Button & Chatbot */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end">
        {!showChatbot ? (
          <button
            className="w-14 h-14 bg-gradient-to-r from-green-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300 animate-bounce"
            onClick={() => setShowChatbot(true)}
          >
            <SearchIcon className="w-6 h-6" />
          </button>
        ) : (
          <>
            <div className="mb-2">
              <Chatbot />
            </div>
            <button
              className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full shadow-xl flex items-center justify-center text-white hover:shadow-2xl transition-all duration-300 animate-spin mr-12"
              onClick={() => setShowChatbot(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </>
  );
}