import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MapPin, Star, Clock, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DestinationGrid({ destinations, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="glass-effect rounded-3xl p-4 animate-pulse">
            <div className="flex space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-2xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No places found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  const categoryColors = {
    heritage: "bg-amber-100 text-amber-800",
    cultural: "bg-purple-100 text-purple-800",
    spiritual: "bg-blue-100 text-blue-800",
    natural: "bg-green-100 text-green-800",
    colonial: "bg-gray-100 text-gray-800",
    artistic: "bg-pink-100 text-pink-800"
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {destinations.map((destination) => (
        <Link 
          key={destination.id}
          to={createPageUrl(`DestinationDetail?id=${destination.id}`)}
          className="group"
        >
          <div className="glass-effect rounded-3xl p-4 app-shadow hover:shadow-xl transition-all duration-300 group-hover:scale-102">
            <div className="flex space-x-4">
              <div className="relative">
                <img
                  src={destination.image_url}
                  alt={destination.name}
                  className="w-24 h-24 rounded-2xl object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {destination.featured && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-current" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-red-600 transition-colors">
                  {destination.name}
                </h3>
                
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{destination.location}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {destination.short_description || destination.description?.substring(0, 100) + "..."}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge className={`${categoryColors[destination.category]} text-xs`}>
                      {destination.category}
                    </Badge>
                    {destination.type && (
                      <Badge variant="outline" className="text-xs">
                        {destination.type}
                      </Badge>
                    )}
                  </div>
                  
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
      ))}
    </div>
  );
}