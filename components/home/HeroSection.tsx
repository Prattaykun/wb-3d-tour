"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type HeroSectionProps = {
  heroImages: string[];
  currentImageIndex: number;
};

export default function HeroSection({ heroImages, currentImageIndex }: HeroSectionProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image}
            alt="West Bengal Heritage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-extrabold font-display mb-6 leading-tight shadow-text">
            Discover
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-400 to-indigo-300">
              West Bengal
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-10 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Journey through centuries of rich heritage, vibrant festivals, magnificent temples,
            and the warmth of Bengali culture.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/MyTourPlan"
              className="group bg-indigo-600 px-8 py-3 rounded-full font-semibold text-white hover:bg-purple-600 transition-all transform hover:scale-105 shadow-xl inline-flex items-center text-lg"
            >
              Plan Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroImages.map((_, index) => (
          <div
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              index === currentImageIndex ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
