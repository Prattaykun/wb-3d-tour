"use client";

import { motion } from "framer-motion";
import { Music, Palette, Book, Theater } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import CultureSection from "../../components/culture/CultureSection";
import ArtistShowcase from "../../components/culture/ArtistShowcase";
import TraditionTimeline from "../../components/culture/TraditionTimeline";

export default function Culture() {
  const router = useRouter();
const culturalAspects = [
  {
    id: "music-dance",
    title: "Music & Dance",
    icon: Music,
    description: "Rich tradition of classical music, folk songs, and dance forms",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    highlights: ["Rabindra Sangeet", "Baul Music", "Classical Dance", "Folk Dance"],
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "literature-poetry",
    title: "Literature & Poetry",
    icon: Book,
    description: "Bengal Renaissance and literary excellence spanning centuries",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    highlights: ["Rabindranath Tagore", "Bengali Poetry", "Modern Literature", "Cultural Magazines"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "traditional-arts",
    title: "Traditional Arts",
    icon: Palette,
    description: "Exquisite handicrafts, paintings, and traditional art forms",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    highlights: ["Terracotta Art", "Pattachitra", "Kantha Embroidery", "Clay Dolls"],
    color: "from-orange-500 to-red-500",
  },
  {
    id: "theater-cinema",
    title: "Theater & Cinema",
    icon: Theater,
    description: "Vibrant theater tradition and birthplace of Indian cinema",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&q=80",
    highlights: ["Group Theater", "Bengali Cinema", "Street Theater", "Cultural Centers"],
    color: "from-green-500 to-teal-500",
  },
];


  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90" />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80"
            alt="Bengali Culture"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Culture & <span className="text-yellow-400">Arts</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Immerse yourself in the vibrant cultural heritage of West Bengal,
              where art, music, literature, and traditions have flourished for
              centuries
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  500+
                </div>
                <div className="text-sm opacity-90">Cultural Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  2000+
                </div>
                <div className="text-sm opacity-90">Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">15</div>
                <div className="text-sm opacity-90">Art Forms</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  100+
                </div>
                <div className="text-sm opacity-90">Cultural Centers</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cultural Aspects */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cultural <span className="text-purple-600">Treasures</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the diverse cultural elements that make West Bengal a
              center of artistic excellence
            </p>
          </motion.div>

          <div className="space-y-20">
            {culturalAspects.map((aspect, index) => (
              <CultureSection
                key={aspect.title}
                aspect={aspect}
                index={index}
                isReverse={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </section>

      <ArtistShowcase />
      <TraditionTimeline />

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6">Experience Living Culture</h2>
            <p className="text-xl mb-8 opacity-90">
              Join cultural workshops, attend performances, and connect with
              local artists to truly understand Bengali culture
            </p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"onClick={() => router.push("/events")}>
              Find Cultural Events
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
