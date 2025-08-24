import React from "react";

export default function CategoryTabs({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="px-4 mb-6">
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-6 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-all flex items-center space-x-2 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg transform scale-105'
                : 'glass-effect text-gray-700 hover:shadow-lg hover:scale-105'
            }`}
          >
            <span>{category.name}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              selectedCategory === category.id 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-100 text-gray-500'
            }`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}