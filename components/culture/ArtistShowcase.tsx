"use client";

import { Award, Music, Palette, Theater } from "lucide-react";

export default function ArtistShowcase() {
  const artists = [
    {
      name: "Rabindranath Tagore",
      category: "Literature & Music",
      achievement: "Nobel Prize Winner 1913",
      icon: Music,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
      description:
        "Poet, musician, and artist who reshaped Bengali literature and music",
    },
    {
      name: "Satyajit Ray",
      category: "Cinema",
      achievement: "Academy Award Winner",
      icon: Theater,
      image:
        "https://images.unsplash.com/photo-1503095396549-807759245b35?w=300&q=80",
      description:
        "Legendary filmmaker who brought Bengali cinema to world stage",
    },
    {
      name: "Jamini Roy",
      category: "Visual Arts",
      achievement: "Padma Bhushan Recipient",
      icon: Palette,
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80",
      description:
        "Pioneering artist who modernized Indian folk art traditions",
    },
    {
      name: "Ustad Allauddin Khan",
      category: "Classical Music",
      achievement: "Sangeet Natak Akademi Award",
      icon: Music,
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
      description:
        "Legendary classical musician and teacher of renowned artists",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16 transition-all duration-700 ease-in-out">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Legendary <span className="text-purple-600">Artists</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Celebrate the extraordinary artists who have shaped Bengali culture
            and gained international recognition
          </p>
        </div>

        {/* Artist Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {artists.map((artist) => (
            <div
              key={artist.name}
              className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image + Icon */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <artist.icon className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {artist.name}
                </h3>

                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {artist.category}
                </div>

                <div className="flex items-center justify-center text-yellow-600 text-sm font-semibold mb-3">
                  <Award className="w-4 h-4 mr-1" />
                  {artist.achievement}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {artist.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
