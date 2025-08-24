import React from "react";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function EventCard({ event, type }) {
  const categoryColors = {
    festival: "bg-orange-100 text-orange-800",
    fair: "bg-green-100 text-green-800",
    performance: "bg-purple-100 text-purple-800",
    exhibition: "bg-blue-100 text-blue-800",
    celebration: "bg-pink-100 text-pink-800",
    ceremony: "bg-indigo-100 text-indigo-800"
  };

  return (
    <div className="glass-effect rounded-3xl p-4 app-shadow hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="flex space-x-4">
        <div className="relative">
          <img
            src={event.image_url || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop"}
            alt={event.name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          {type === "ongoing" && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
            <Calendar className="w-3 h-3 text-gray-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-gray-900 text-lg">{event.name}</h3>
            {type === "ongoing" && (
              <Badge className="bg-green-100 text-green-800 text-xs">
                Live
              </Badge>
            )}
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge className={`${categoryColors[event.category]} text-xs font-medium`}>
              {event.category}
            </Badge>
            
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>{format(new Date(event.start_date), "MMM d, yyyy")}</span>
            </div>
          </div>
          
          {event.cultural_significance && (
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {event.cultural_significance}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}