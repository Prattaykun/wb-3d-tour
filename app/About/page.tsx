"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Globe,
  Award,
  MapPin,
  Calendar,
  Camera,
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { icon: MapPin, label: "Districts Covered", value: "23", color: "text-blue-500" },
    { icon: Users, label: "Annual Visitors", value: "50M+", color: "text-green-500" },
    { icon: Calendar, label: "Heritage Sites", value: "200+", color: "text-purple-500" },
    { icon: Camera, label: "Cultural Events", value: "1000+", color: "text-orange-500" },
  ];

  const team = [
    {
      name: "Cultural Heritage Division",
      role: "Heritage Preservation",
      description: "Dedicated to preserving and promoting West Bengal's rich cultural heritage",
      icon: Heart,
    },
    {
      name: "Tourism Development",
      role: "Experience Creation",
      description: "Creating unforgettable experiences for visitors from around the world",
      icon: Globe,
    },
    {
      name: "Community Engagement",
      role: "Local Partnerships",
      description: "Working with local communities to showcase authentic Bengali culture",
      icon: Users,
    },
    {
      name: "Digital Innovation",
      role: "Technology Integration",
      description: "Using modern technology to make heritage accessible to everyone",
      icon: Award,
    },
  ];

  const milestones = [
  { 
    year: "2020", 
    title: "WB Tour Launched", 
    description: "Started as a digital platform to showcase West Bengal's heritage. The initial launch featured curated guides, photographs, and cultural insights that helped travelers discover Bengal’s unique history and traditions." 
  },
  { 
    year: "2021", 
    title: "Heritage Mapping", 
    description: "Documented over 200 heritage sites across 23 districts. Each site was mapped with historical notes, travel tips, and high-quality images to create a rich digital archive for future generations." 
  },
  { 
    year: "2022", 
    title: "Community Partnership", 
    description: "Partnered with local communities and cultural organizations. Collaborations with artisans, storytellers, and regional tourism boards helped bring authentic experiences to users while boosting local economies." 
  },
  { 
    year: "2023", 
    title: "International Recognition", 
    description: "Recognized as a leading cultural tourism platform. Featured in travel magazines, awarded by cultural institutions, and celebrated globally for promoting Bengal’s diverse heritage in an innovative way." 
  },
  { 
    year: "2024", 
    title: "Digital Innovation", 
    description: "Launched interactive features and virtual experiences. Users can now explore monuments in 3D, join immersive Durga Puja festivals online, and enjoy AR/VR-powered cultural storytelling like never before." 
  },
];


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80" />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80"
            alt="About WB Tour"
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
              About <span className="text-yellow-400">WB Tour</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Connecting hearts with the timeless beauty, rich heritage, and vibrant culture 
              of West Bengal through authentic experiences and storytelling
            </p>
          </motion.div>
        </div>
      </section>

       {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Mission</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To preserve, celebrate, and share the extraordinary cultural heritage of West Bengal 
              with the world, creating meaningful connections between past and present, 
              local and global, tradition and innovation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Heritage Preservation</h3>
              <p className="text-gray-600 leading-relaxed">
                Documenting and preserving West Bengal's rich cultural heritage for future generations 
                through digital storytelling and community engagement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-8 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Connection</h3>
              <p className="text-gray-600 leading-relaxed">
                Building bridges between local communities and global visitors, 
                fostering cultural understanding and authentic experiences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Outreach</h3>
              <p className="text-gray-600 leading-relaxed">
                Showcasing West Bengal's cultural treasures to the world, 
                making heritage accessible through modern technology and storytelling.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-yellow-400">Impact</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Measuring our commitment to preserving and sharing West Bengal's heritage
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated professionals working together to celebrate and preserve West Bengal's heritage
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
                  <member.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-sm text-blue-600 font-medium mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Milestones in our mission to celebrate West Bengal's heritage
            </p>
          </motion.div>
<div className="relative">
  {/* Timeline Line - visible on all screens */}
  <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />

  <div className="space-y-12">
    {milestones.map((milestone, index) => (
      <motion.div
        key={milestone.year}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`flex flex-col md:flex-row items-center ${
          index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        {/* Card */}
        <div
          className={`w-full md:w-5/12 ${
            index % 2 === 0 ? "md:text-right" : ""
          }`}
        >
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg relative z-10">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {milestone.year}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {milestone.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {milestone.description}
            </p>
          </div>
        </div>

        {/* Timeline Node */}
        <div className="flex w-full md:w-2/12 justify-center my-4 md:my-0 z-20">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-lg" />
        </div>

        {/* Empty filler (only desktop) */}
        <div className="hidden md:block w-full md:w-5/12" />
      </motion.div>
    ))}
  </div>
</div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Be part of our journey to preserve and celebrate West Bengal's incredible heritage. 
              Together, we can keep these traditions alive for future generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                Get Involved
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105">
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
