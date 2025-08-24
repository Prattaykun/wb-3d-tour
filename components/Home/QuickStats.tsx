import React from "react";
import { MapPin, Calendar, Heart, Camera } from "lucide-react";

export default function QuickStats() {
  const stats = [
    { icon: MapPin, label: "Heritage Sites", value: "150+", color: "from-red-500 to-pink-500" },
    { icon: Calendar, label: "Festivals", value: "50+", color: "from-orange-500 to-yellow-500" },
    { icon: Heart, label: "Cultural Events", value: "100+", color: "from-purple-500 to-indigo-500" },
    { icon: Camera, label: "Photo Spots", value: "200+", color: "from-green-500 to-emerald-500" }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="glass-effect rounded-3xl p-4 text-center app-shadow hover:shadow-xl transition-all duration-300">
          <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}