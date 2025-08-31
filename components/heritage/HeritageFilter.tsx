"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building, Crown, Home, Church } from "lucide-react";

type HeritageFilterProps = {
  activeFilter: string;
  setActiveFilter: (id: string) => void;
};

export default function HeritageFilter({
  activeFilter,
  setActiveFilter,
}: HeritageFilterProps) {
  const filters = [
    { id: "all", label: "All Sites", icon: Building, count: 50 },
    { id: "monument", label: "Monuments", icon: Building, count: 15 },
    { id: "temple", label: "Temples", icon: Church, count: 20 },
    { id: "palace", label: "Palaces", icon: Crown, count: 8 },
    { id: "architecture", label: "Architecture", icon: Home, count: 7 },
  ];

  return (
    <div className="mb-12">
      <div className="flex flex-wrap justify-center gap-4">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeFilter === filter.id
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-md"
            }`}
          >
            <filter.icon className="w-4 h-4" />
            <span>{filter.label}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                activeFilter === filter.id
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {filter.count}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
