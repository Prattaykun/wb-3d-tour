"use client";

import React from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type CulturalEvent = {
  id: string;
  name: string;
  location: string;
  category: "festival" | "fair" | "performance" | "exhibition" | "celebration" | "ceremony";
  start_date: string;
  image_url?: string;
};

type Props = {
  events: CulturalEvent[];
  isLoading: boolean;
};

export default function CulturalHighlight({ events, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="glass-effect rounded-3xl p-4 animate-pulse">
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="glass-effect rounded-3xl p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No upcoming cultural events</p>
      </div>
    );
  }

  const categoryColors: Record<CulturalEvent["category"], string> = {
    festival: "bg-orange-100 text-orange-800",
    fair: "bg-green-100 text-green-800",
    performance: "bg-purple-100 text-purple-800",
    exhibition: "bg-blue-100 text-blue-800",
    celebration: "bg-pink-100 text-pink-800",
    ceremony: "bg-indigo-100 text-indigo-800",
  };

  return (
    <div className="space-y-4">
      {events.slice(0, 3).map((event) => (
        <div
          key={event.id}
          className="glass-effect rounded-3xl p-4 app-shadow hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <div className="flex space-x-4">
            <div className="relative">
              <img
                src={
                  event.image_url ||
                  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop"
                }
                alt={event.name}
                className="w-16 h-16 rounded-2xl object-cover"
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <Calendar className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">{event.name}</h3>
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
                  <span>{format(new Date(event.start_date), "MMM d")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
