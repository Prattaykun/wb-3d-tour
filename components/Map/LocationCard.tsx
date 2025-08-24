import React from "react";
import { X, MapPin, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LocationCard({ destination, onClose }) {
  return (
    <div className="glass-effect rounded-3xl p-4 app-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 text-lg">{destination.name}</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-xl">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex space-x-4">
        <img
          src={destination.image_url}
          alt={destination.name}
          className="w-16 h-16 rounded-2xl object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{destination.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {destination.category}
            </Badge>
            {destination.rating && (
              <div className="flex items-center text-xs">
                <Star className="w-3 h-3 text-yellow-400 mr-1" />
                <span>{destination.rating}</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" className="h-8 px-3 text-xs bg-gradient-to-r from-red-500 to-orange-500">
              Visit
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3 text-xs">
              Directions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}