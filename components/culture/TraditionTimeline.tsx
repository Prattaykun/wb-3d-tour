"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Star, Heart } from "lucide-react";

export default function TraditionTimeline() {
  const traditions = [
   {
  period: "Ancient Era",
  year: "Before 1000 CE",
  title: "Folk Traditions Take Root",
  description:
    "Bengal’s cultural fabric was woven early through vibrant folk music, dance, and oral storytelling traditions such as Baul songs, which blend Sufi mysticism and Vaishnava devotional poetry. These folk forms often accompanied village rituals, seasonal celebrations, and harvest festivals." ,
  icon: Users,
  color: "from-amber-500 to-orange-500",
},
{
  period: "Medieval Period",
  year: "1200–1700 CE",
  title: "Temples & Terracotta Art Flourish",
  description:
    "During the medieval era, Bengal evolved a distinctive temple architecture style using brick and terracotta due to limited stone resources. Temples featured curved chala roofs and ornate terracotta panels depicting scenes from epics like the Ramayana and Mahabharata." ,
  icon: Star,
  color: "from-blue-500 to-purple-500",
},
{
  period: "Bengal Renaissance",
  year: "1800–1900 CE",
  title: "The Great Cultural Awakening",
  description:
    "Spurred by western education and reformist thought, this era witnessed a remarkable surge in modern literature, art, and theater. Bengali intellectuals and artists reshaped cultural identity through literature, stage performances, and social reform movements." ,
  icon: Heart,
  color: "from-green-500 to-teal-500",
},
{
  period: "Modern Era",
  year: "1900–Present",
  title: "A Culture on the World Stage",
  description:
    "Bengali arts gained global recognition in modern times through cinema, literature, music, and dance. Artists like Satyajit Ray and Rabindranath Tagore brought international acclaim, while folk and classical arts continue to inspire global audiences." ,
  icon: Calendar,
  color: "from-red-500 to-pink-500",
},

  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Cultural <span className="text-purple-600">Timeline</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Journey through the evolution of Bengali culture across centuries
          </p>
        </motion.div>
{/* Timeline */}
<div className="relative">
  {/* Desktop Vertical Line */}
  <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 hidden md:block" />

  {/* Mobile Vertical Line (left side) */}
  <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 md:hidden" />

  <div className="space-y-12">
    {traditions.map((tradition, index) => (
      <motion.div
        key={tradition.period}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.2 }}
        className={`flex md:items-center ${
          index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        {/* Content */}
        <div
          className={`w-full md:w-5/12 ${
            index % 2 === 0 ? "md:text-right" : ""
          }`}
        >
          <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            {/* Mobile Timeline Node */}
            <div className="absolute -left-7 top-6 w-5 h-5 bg-gradient-to-r md:hidden rounded-full border-4 border-white shadow-lg" />

            <div
              className={`inline-flex w-12 h-12 bg-gradient-to-r ${tradition.color} rounded-full items-center justify-center mb-4`}
            >
              <tradition.icon className="w-6 h-6 text-white" />
            </div>

            <div className="text-sm font-semibold text-gray-500 mb-1">
              {tradition.year}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {tradition.title}
            </h3>

            <p className="text-gray-600 leading-relaxed">
              {tradition.description}
            </p>
          </div>
        </div>

        {/* Timeline Node (Desktop Center) */}
        <div className="hidden md:flex w-2/12 justify-center">
          <div
            className={`w-6 h-6 bg-gradient-to-r ${tradition.color} rounded-full border-4 border-white shadow-lg`}
          />
        </div>

        {/* Right empty column only for desktop */}
        <div className="hidden md:block md:w-5/12" />
      </motion.div>
    ))}
  </div>
</div>


      </div>
    </section>
  );
}
