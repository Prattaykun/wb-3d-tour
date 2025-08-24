import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import { Mountain, Building, Waves, Trees, Church, MapPin, Flower } from "lucide-react";

export default function CategoryShowcase() {
  const categories = [
    {
      name: "Hills & Mountains",
      category: "hills",
      icon: Mountain,
      description: "Explore the majestic Himalayas and tea gardens",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      color: "from-green-600 to-emerald-700"
    },
    {
      name: "Heritage Sites",
      category: "heritage",
      icon: Building,
      description: "Discover palaces, monuments and historical treasures",
      image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop",
      color: "from-amber-600 to-orange-700"
    },
    {
      name: "Coastal Beauty",
      category: "beaches",
      icon: Waves,
      description: "Relax at serene beaches along the Bay of Bengal",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      color: "from-blue-600 to-cyan-700"
    },
    {
      name: "Wildlife Sanctuaries",
      category: "wildlife",
      icon: Trees,
      description: "Experience the famous Sundarbans and wildlife",
      image: "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&h=600&fit=crop",
      color: "from-emerald-600 to-green-700"
    },
    {
      name: "Sacred Temples",
      category: "temples",
      icon: Church,
      description: "Visit ancient temples and spiritual destinations",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      color: "from-purple-600 to-indigo-700"
    },
    {
      name: "Rural Bengal",
      category: "rural",
      icon: Flower,
      description: "Experience authentic village life and traditions",
      image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop",
      color: "from-orange-600 to-red-700"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Discover by
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Category</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From mystical mountains to ancient heritage sites, West Bengal offers diverse experiences 
            for every type of traveler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link 
              key={category.category}
              to={createPageUrl(`Destinations?category=${category.category}`)}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                {/* Background Image */}
                <div className="h-80 relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-75 group-hover:opacity-60 transition-opacity duration-300`}></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                      <category.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-white/90 group-hover:text-white transition-colors">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center text-yellow-300 font-semibold group-hover:text-yellow-200 transition-colors">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Explore destinations</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}