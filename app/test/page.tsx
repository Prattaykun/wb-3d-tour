"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Place = {
  id: string;
  images: string; // Cloudinary image URL
};

export default function TestPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      const { data, error } = await supabase.from("places").select("id, images");
      if (error) {
        console.error("Error fetching places:", error.message);
      } else {
        setPlaces(data || []);
      }
      setLoading(false);
    };

    fetchPlaces();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500 animate-pulse">
        Loading images...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Places Gallery</h1>

      {places.length === 0 ? (
        <p className="text-center text-gray-500">No places found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {places.map((place) => (
            <div
              key={place.id}
              className="rounded-xl shadow-lg overflow-hidden group"
            >
              <img
                src={place.images}
                alt="Place"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
