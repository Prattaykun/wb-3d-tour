import React from "react";
import { Cloud, Sun, MapPin } from "lucide-react";

export default function WeatherWidget() {
  return (
    <div className="glass-effect rounded-3xl p-4 app-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-sky-500 rounded-2xl flex items-center justify-center">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center text-gray-600 text-sm mb-1">
              <MapPin className="w-3 h-3 mr-1" />
              <span>Kolkata</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">28°C</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-gray-600 text-sm mb-1">Perfect for</div>
          <div className="text-sm font-medium text-gray-900">Heritage Tours</div>
        </div>
      </div>
    </div>
  );
}