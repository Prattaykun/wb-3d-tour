import React from "react";
import { MapPin, Heart, Calendar, Camera } from "lucide-react";

export default function ProfileStats() {
  const stats = [
    { icon: MapPin, label: "Visited", value: "12", color: "text-blue-500" },
    { icon: Heart, label: "Favorites", value: "8", color: "text-red-500" },
    { icon: Calendar, label: "Events", value: "5", color: "text-green-500" },
    { icon: Camera, label: "Photos", value: "24", color: "text-purple-500" }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className={`w-8 h-8 mx-auto mb-2 ${stat.color}`}>
            <stat.icon className="w-full h-full" />
          </div>
          <div className="text-lg font-bold text-gray-900">{stat.value}</div>
          <div className="text-xs text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}