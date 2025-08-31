"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LucideIcon } from "lucide-react";

type Aspect = {
  id: number | string;
  title: string;
  icon: LucideIcon;
  description: string;
  image: string;
  highlights: string[];
  color: string;
};

type CultureSectionProps = {
  aspect: Aspect;
  index: number;
  isReverse: boolean;
};

export default function CultureSection({ aspect, isReverse }: CultureSectionProps) {
  const Icon = aspect.icon;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={`grid md:grid-cols-2 gap-12 items-center ${
        isReverse ? "md:grid-flow-dense" : ""
      }`}
    >
      {/* Text + Button */}
      <div className={`${isReverse ? "md:col-start-2" : ""}`}>
        <div
          className={`w-16 h-16 bg-gradient-to-r ${aspect.color} rounded-2xl flex items-center justify-center mb-6`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {aspect.title}
        </h3>

        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          {aspect.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {aspect.highlights.map((highlight, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
            >
              <span className="font-medium text-gray-800 text-sm">
                {highlight}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          {showDetails ? "Show Less" : "Learn More"}
        </button>

        {/* Expandable Details */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showDetails ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-inner">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              More About {aspect.title}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              This section gives deeper insights into <strong>{aspect.title}</strong>.
              It explores the historical background, influence on society, and its
              contribution to shaping the cultural identity of Bengal over centuries.
            </p>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className={`${isReverse ? "md:col-start-1" : ""}`}>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300" />
          <Image
            src={aspect.image}
            alt={aspect.title}
            width={600}
            height={400}
            className="relative w-full h-96 object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
}
