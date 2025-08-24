import React from "react";
import { MapPin, Navigation } from "lucide-react";

export default function NearbyPlaces({ userLocation, destinations }) {
  // Mock calculation - in real app would use proper distance calculation
  const nearbyDestinations = destinations.slice(0, 3);

  if (nearbyDestinations.length === 0) return null;

  return (
    <div className="absolute bottom-20 left-4 right-4 z-10">
      <div className="glass-effect rounded-2xl p-4">
        <div className="flex items-center mb-3">
          <Navigation className="w-4 h-4 mr-2 text-blue-500" />
          <h3 className="font-semibold text-gray-900 text-sm">Nearby Places</h3>
        </div>
        
        <div className="space-y-2">
          {nearbyDestinations.map((destination) => (
            <div key={destination.id} className="flex items-center space-x-3 p-2 hover:bg-white/50 rounded-lg cursor-pointer">
              <img
                src={destination.image_url}
                alt={destination.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{destination.name}</h4>
                <div className="flex items-center text-gray-500 text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{Math.floor(Math.random() * 5) + 1} km away</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}