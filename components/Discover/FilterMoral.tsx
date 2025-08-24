import React from "react";
import { X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FilterModal({ filters, onFiltersChange, onClose, destinations }) {
  const districts = [...new Set(destinations.map(d => d.district).filter(Boolean))];
  const types = [...new Set(destinations.map(d => d.type).filter(Boolean))];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      type: "all",
      rating: "all",
      district: "all"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl p-6 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Filter className="w-5 h-5 mr-2 text-red-500" />
            Filter Places
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger className="h-12 rounded-2xl">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">District</label>
            <Select value={filters.district} onValueChange={(value) => handleFilterChange('district', value)}>
              <SelectTrigger className="h-12 rounded-2xl">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map(district => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Rating</label>
            <Select value={filters.rating} onValueChange={(value) => handleFilterChange('rating', value)}>
              <SelectTrigger className="h-12 rounded-2xl">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rating</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex space-x-3 mt-8">
          <Button variant="outline" onClick={resetFilters} className="flex-1 h-12 rounded-2xl">
            Reset
          </Button>
          <Button onClick={onClose} className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}