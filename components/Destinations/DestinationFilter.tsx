import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DestinationFilters({ onFilterChange, selectedCategory, selectedPriceRange }) {
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "hills", label: "Hills & Mountains" },
    { value: "heritage", label: "Heritage Sites" },
    { value: "beaches", label: "Beaches" },
    { value: "wildlife", label: "Wildlife" },
    { value: "temples", label: "Temples" },
    { value: "cities", label: "Cities" },
    { value: "rural", label: "Rural Bengal" }
  ];

  const priceRanges = [
    { value: "all", label: "All Budgets" },
    { value: "budget", label: "Budget Friendly" },
    { value: "mid-range", label: "Mid Range" },
    { value: "luxury", label: "Luxury" }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <Select
        value={selectedCategory}
        onValueChange={(value) => onFilterChange({ category: value, priceRange: selectedPriceRange })}
      >
        <SelectTrigger className="w-full lg:w-48 h-12">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedPriceRange}
        onValueChange={(value) => onFilterChange({ category: selectedCategory, priceRange: value })}
      >
        <SelectTrigger className="w-full lg:w-48 h-12">
          <SelectValue placeholder="Budget" />
        </SelectTrigger>
        <SelectContent>
          {priceRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}