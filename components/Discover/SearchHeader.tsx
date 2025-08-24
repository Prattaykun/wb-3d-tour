import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchHeader({ searchQuery, onSearchChange, onFilterClick }) {
  return (
    <div className="px-4 mb-6">
      <div className="relative flex space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search places, districts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 rounded-2xl border-gray-200 glass-effect"
          />
        </div>
        <button 
          onClick={onFilterClick}
          className="w-12 h-12 glass-effect rounded-2xl flex items-center justify-center hover:shadow-lg transition-all"
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}