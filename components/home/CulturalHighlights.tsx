"use client";

import React from "react";
import { motion } from "framer-motion";
import { Music, Palette, Theater, Camera } from "lucide-react";

export default function CulturalHighlights() {
  const culturalAspects = [
    {
      icon: Music,
      title: "Classical Music",
      description: "Rich tradition of Rabindra Sangeet and classical ragas",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Palette,
      title: "Traditional Arts",
      description: "Exquisite handicrafts, terracotta work, and paintings",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: Theater,
      title: "Bengali Theater",
      description: "Vibrant theater scene and cultural performances",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Camera,
      title: "Film Heritage",
      description: "Birthplace of legendary filmmakers and cinema",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Cultural <span className="text-orange-400">Heritage</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            West Bengal&apos;s cultural tapestry is woven with centuries of
            artistic excellence, literary brilliance, and creative expression.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {culturalAspects.map((aspect, index) => (
            <motion.div
              key={aspect.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="relative mb-6">
                <div
                  className={`w-24 h-24 mx-auto bg-gradient-to-br ${aspect.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <aspect.icon className="w-12 h-12 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors">
                {aspect.title}
              </h3>

              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {aspect.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tagore Section */}
        <div className="mt-16 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-orange-500/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4 text-orange-400">
                Tagore&apos;s Legacy
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                West Bengal is the birthplace of Rabindranath Tagore, the Nobel
                Prize-winning poet, whose influence on Bengali culture, music,
                and literature continues to inspire generations.
              </p>
              <div className="flex space-x-6 text-sm">
                <div>
                  <div className="text-2xl font-bold text-orange-400">2000+</div>
                  <div className="text-gray-400">Songs Composed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">1913</div>
                  <div className="text-gray-400">Nobel Prize</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80"
                alt="Tagore Legacy"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
