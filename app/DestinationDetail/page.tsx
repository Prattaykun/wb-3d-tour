"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import destinationsData from "@/shared/Destination.json";
import {
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowLeft,
  Camera,
  Clock,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import BookingForm from "@/components/destination/BookingForm";
import ImageGallery from "@/components/destination/ImageGallery";
import ActivitiesList from "@/components/destination/ActivitiesList";

type Destination = {
  id: string;
  name: string;
  category: string;
  price_range?: string;   // allow any string, not just union
  difficulty?: string;
  image_url: string;
  gallery_images?: string[];
  activities?: string[];
  description: string;
  best_time?: string;
  duration?: string;
  location: string;
  featured?: boolean;
};


export default function DestinationDetail() {
  const searchParams = useSearchParams();
  const destinationId = searchParams.get("id");

  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (destinationId) {
      loadDestination();
    }
  }, [destinationId]);

  const loadDestination = async () => {
    try {
      const found = destinationsData.find((d) => d.id === destinationId);
      if (found) {
        setDestination(found);
      }
    } catch (error) {
      console.error("Error loading destination:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-96 bg-gray-200"></div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Destination not found
          </h1>
          <Link href={createPageUrl("Destinations")}>
            <Button>Back to Destinations</Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    hills: "bg-green-100 text-green-800",
    heritage: "bg-amber-100 text-amber-800",
    beaches: "bg-blue-100 text-blue-800",
    wildlife: "bg-emerald-100 text-emerald-800",
    temples: "bg-purple-100 text-purple-800",
    cities: "bg-gray-100 text-gray-800",
    rural: "bg-orange-100 text-orange-800",
  };

  const priceRangeLabels: Record<string, string> = {
    budget: "Budget Friendly",
    "mid-range": "Mid Range",
    luxury: "Luxury",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={destination.image_url}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link href={createPageUrl("Destinations")}>
            <Button
              variant="outline"
              className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Destinations
            </Button>
          </Link>
        </div>

        {/* Destination Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={`${categoryColors[destination.category]} border-0`}>
                {destination.category.charAt(0).toUpperCase() +
                  destination.category.slice(1)}
              </Badge>
              {destination.price_range && (
                <Badge
                  variant="outline"
                  className="bg-white/20 text-white border-white/30"
                >
                  <DollarSign className="w-3 h-3 mr-1" />
                  {priceRangeLabels[destination.price_range]}
                </Badge>
              )}
              {destination.difficulty && (
                <Badge
                  variant="outline"
                  className="bg-white/20 text-white border-white/30"
                >
                  {destination.difficulty.charAt(0).toUpperCase() +
                    destination.difficulty.slice(1)}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {destination.name}
            </h1>
            <div className="flex items-center text-white/90">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">
                {destination.location}, West Bengal
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About {destination.name}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {destination.description}
                </p>
              </div>

              {/* Image Gallery */}
              {destination.gallery_images &&
                destination.gallery_images.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Camera className="w-6 h-6 mr-2 text-orange-500" />
                      Gallery
                    </h2>
                    <ImageGallery images={destination.gallery_images} />
                  </div>
                )}

              {/* Activities */}
              {destination.activities && destination.activities.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Things to Do
                  </h2>
                  <ActivitiesList activities={destination.activities} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Trip Details
                </h3>
                <div className="space-y-4">
                  {destination.best_time && (
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Best Time</p>
                        <p className="text-gray-600">{destination.best_time}</p>
                      </div>
                    </div>
                  )}
                  {destination.duration && (
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Duration</p>
                        <p className="text-gray-600">{destination.duration}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Location</p>
                      <p className="text-gray-600">
                        {destination.location}, West Bengal
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form Trigger */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-sm p-6 border border-orange-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Plan Your Visit
                </h3>
                <p className="text-gray-600 mb-6">
                  Ready to explore {destination.name}? Let us help you plan the
                  perfect trip.
                </p>
                <Button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Book This Trip
                </Button>
              </div>

              {/* Featured Badge */}
              {destination.featured && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="font-semibold text-yellow-800">
                      Featured Destination
                    </span>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    This is one of our most popular destinations, carefully
                    selected for its exceptional beauty and experiences.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingForm && (
        <BookingForm
          destination={destination}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
}
