"use client";

import React, { useState, useEffect } from "react";
import destinations from "@/shared/Destination.json";
import events from "@/shared/CulturalEvent.json";
import { MapPin, Star, Calendar, ArrowRight, Sparkles, Heart, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import HeroSection from "@/components/Home/HeroSection";
import QuickStats from "@/components/Home/QuickStats";
import FeaturedCard from "@/components/Home/FeaturedCard";
import CulturalHighlight from "@/components/Home/CulturalHighlight";
import WeatherWidget from "@/components/Home/WeatherWidget";

export default function Home() {
  const [featuredDestinations, setFeaturedDestinations] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // simulate filtering since JSON is just an array
    const dests = destinations.filter((d: any) => d.featured).slice(0, 6);
    const evs = events.filter((e: any) => e.featured).slice(0, 5);

    setFeaturedDestinations(dests);
    setUpcomingEvents(evs);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Quick Stats */}
      <section className="px-4 -mt-8 relative z-20">
        <QuickStats />
      </section>

      {/* Weather Widget */}
      <section className="px-4 mt-6">
        <WeatherWidget />
      </section>

      {/* Cultural Highlights */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-orange-500" />
            Cultural Highlights
          </h2>
          <button className="text-red-500 font-medium text-sm flex items-center">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <CulturalHighlight events={upcomingEvents} isLoading={isLoading} />
      </section>

      {/* Featured Destinations */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-red-500" />
            Must Visit Places
          </h2>
          <button className="text-red-500 font-medium text-sm flex items-center">
            Explore All <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="glass-effect rounded-3xl p-4 animate-pulse">
                  <div className="flex space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            featuredDestinations.map((destination) => (
              <FeaturedCard key={destination.id} destination={destination} />
            ))
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 mt-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-pink-500" />
          Explore Bengal
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-effect rounded-3xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Heritage Sites</h3>
            <p className="text-xs text-gray-600">Explore historical monuments</p>
          </div>

          <div className="glass-effect rounded-3xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Festivals</h3>
            <p className="text-xs text-gray-600">Join cultural celebrations</p>
          </div>
        </div>
      </section>
    </div>
  );
}
