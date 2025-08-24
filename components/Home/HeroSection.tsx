import React from "react";
import { MapPin, Star, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative h-80 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1605649487212-47bdab064bf9?w=800&h=600&fit=crop"
          alt="West Bengal Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 text-white">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Sparkles className="w-4 h-4 mr-2 text-orange-300" />
            <span className="text-orange-300 text-sm font-medium">Discover Bengal</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 leading-tight">
            Explore Rich
            <br />
            <span className="text-orange-300">Heritage & Culture</span>
          </h1>
          <p className="text-white/90 text-sm mb-4 leading-relaxed">
            Journey through Bengal's magnificent palaces, ancient temples,
            vibrant festivals, and timeless traditions.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex space-x-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-2">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold">50+</div>
              <div className="text-xs text-white/80">Places</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-2">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold">4.8</div>
              <div className="text-xs text-white/80">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}