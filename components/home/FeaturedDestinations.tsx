"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";

export default function FeaturedDestinations() {
  const destinations = [
    {
      id: 1,
      name: "Victoria Memorial",
      location: "Kolkata",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
      description:
        "Iconic white marble monument dedicated to Queen Victoria",
      duration: "2-3 hours",
      rating: 4.8,
      category: "Historical Monument",
    },
    {
      id: 2,
      name: "Howrah Bridge",
      location: "Kolkata",
      image:
        "https://images.unsplash.com/photo-1555400082-4b3b94d6d721?w=600&q=80",
      description: "Famous cantilever bridge over the Hooghly River",
      duration: "1 hour",
      rating: 4.6,
      category: "Architecture",
    },
    {
      id: 3,
      name: "Dakshineswar Temple",
      location: "Kolkata",
      image:
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
      description: "Sacred Hindu temple dedicated to Goddess Kali",
      duration: "2 hours",
      rating: 4.7,
      category: "Religious Site",
    },
    {
      id: 4,
      name: "Darjeeling Tea Gardens",
      location: "Darjeeling",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
      description: "Scenic hill station famous for tea plantations",
      duration: "Full Day",
      rating: 4.9,
      category: "Nature & Tea",
    },
  ];

  return (
   <section className="relative py-32 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 overflow-hidden">
  {/* Decorative subtle circles */}
  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-400 rounded-full opacity-10 blur-3xl"></div>
  <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gray-500 rounded-full opacity-10 blur-3xl"></div>

  <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Your content goes here */}
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Featured <span className="text-indigo-700">Destinations</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore the most iconic and culturally significant places that
            define West Bengal&apos;s rich heritage.
          </p>
        </div>

        {/* Destination Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {destinations.map((destination) => (
            <div key={destination.id} className="group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-500 hover:scale-105 hover:shadow-2xl flex flex-col md:flex-row h-full">
                {/* Image */}
                <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    {/* Category + Rating */}
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-orange-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {destination.category}
                      </span>
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center border">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm font-semibold">
                          {destination.rating}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {destination.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {destination.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 text-gray-500 text-sm">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1.5" />
                      {destination.location}
                    </div>

                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {destination.duration}
                    </div>

                    <Link
                      href="/Heritage"
                      className="text-indigo-600 hover:text-purple-600 font-semibold flex items-center group-hover:gap-2 transition-all"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            href="/map"
            className="inline-flex items-center bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-600 transition-all transform hover:scale-105 shadow-lg"
          >
            View All Destinations
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
