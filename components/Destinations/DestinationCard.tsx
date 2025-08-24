import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MapPin, Clock, Star, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DestinationCard({ destination }) {
  const categoryColors = {
    hills: "bg-green-100 text-green-800 border-green-200",
    heritage: "bg-amber-100 text-amber-800 border-amber-200",
    beaches: "bg-blue-100 text-blue-800 border-blue-200",
    wildlife: "bg-emerald-100 text-emerald-800 border-emerald-200",
    temples: "bg-purple-100 text-purple-800 border-purple-200",
    cities: "bg-gray-100 text-gray-800 border-gray-200",
    rural: "bg-orange-100 text-orange-800 border-orange-200"
  };

  const priceRangeColors = {
    budget: "bg-green-100 text-green-700",
    "mid-range": "bg-yellow-100 text-yellow-700",
    luxury: "bg-purple-100 text-purple-700"
  };

  const priceRangeLabels = {
    budget: "Budget",
    "mid-range": "Mid-Range",
    luxury: "Luxury"
  };

  return (
    <Link 
      to={createPageUrl(`DestinationDetail?id=${destination.id}`)}
      className="group block"
    >
      <Card className="overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group-hover:scale-105 border-0 bg-white">
        <div className="relative h-64 overflow-hidden">
          <img
            src={destination.image_url}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <Badge className={`${categoryColors[destination.category]} border font-medium`}>
              {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
            </Badge>
            {destination.featured && (
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-4 h-4 text-white fill-current" />
              </div>
            )}
          </div>

          {/* Bottom overlay info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl font-bold mb-1 group-hover:text-orange-300 transition-colors">
              {destination.name}
            </h3>
            <div className="flex items-center text-white/90">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{destination.location}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
            {destination.short_description || destination.description?.substring(0, 120) + "..."}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            {destination.duration && (
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>{destination.duration}</span>
              </div>
            )}
            {destination.price_range && (
              <Badge className={`${priceRangeColors[destination.price_range]} text-xs`}>
                <DollarSign className="w-3 h-3 mr-1" />
                {priceRangeLabels[destination.price_range]}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            {destination.best_time && (
              <div className="text-xs text-gray-500">
                Best: {destination.best_time}
              </div>
            )}
            <div className="text-orange-600 font-semibold group-hover:text-orange-700 transition-colors text-sm">
              Explore →
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}