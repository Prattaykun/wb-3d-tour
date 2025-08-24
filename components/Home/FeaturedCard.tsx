"use client";

import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FeaturedCard({ destination }: { destination: any }) {
  const categoryColors: Record<string, string> = {
    heritage: "bg-amber-100 text-amber-800 border-amber-200",
    cultural: "bg-purple-100 text-purple-800 border-purple-200",
    spiritual: "bg-blue-100 text-blue-800 border-blue-200",
    natural: "bg-green-100 text-green-800 border-green-200",
    colonial: "bg-gray-100 text-gray-800 border-gray-200",
    artistic: "bg-pink-100 text-pink-800 border-pink-200",
  };

  return (
    <Link href={createPageUrl(`DestinationDetail/${destination.id}`)} className="group">
      <div className="glass-effect rounded-3xl p-4 app-shadow hover:shadow-xl transition-all duration-300 group-hover:scale-102">
        <div className="flex space-x-4">
          <div className="relative">
            <img
              src={destination.image_url}
              alt={destination.name}
              className="w-20 h-20 rounded-2xl object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {destination.featured && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors">
                {destination.name}
              </h3>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="flex items-center text-gray-600 text-sm mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{destination.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <Badge className={`${categoryColors[destination.category]} text-xs font-medium`}>
                {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
              </Badge>
              {destination.rating && (
                <div className="flex items-center space-x-1 text-xs">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="font-medium text-gray-700">{destination.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
