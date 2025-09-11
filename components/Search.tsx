// components/Search.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SearchResult {
  id: string;
  type: 'place' | 'hotel' | 'event' | 'artisan' | 'product';
  name: string;
  image: string | null;
  rating?: number;
  location?: string;
  description?: string;
  [key: string]: any;
}

interface SearchProps {
  placeholder?: string;
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
  compact?: boolean;
}

export default function Search({ 
  placeholder = "Search places, hotels, events, artisans...", 
  onResultSelect,
  className = "",
  compact = false
}: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    places: true,
    hotels: true,
    events: true,
    artisans: true,
    products: true
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [generatedContent, setGeneratedContent] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  
const handleSearch = useCallback(async () => {
  if (!searchQuery.trim()) {
    setSearchResults([]);
    setGeneratedContent([]);
    return;
  }

  setIsLoading(true);
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchQuery }),
    });

    if (!response.ok) throw new Error('Search API failed');

    const { results } = await response.json();
    setSearchResults(results);

  //   // 👇 Trigger Gemini fallback if no results
  //   if (!results || results.length === 0) {
  //     await generateContentWithGemini(searchQuery);
  //   } else {
  //     setGeneratedContent([]); // clear old Gemini content
  //   }
  // } catch (err) {
  //   console.error("Vector search failed:", err);
  //   // 👇 Always try Gemini if vector search errors out
  //   await generateContentWithGemini(searchQuery);
  } finally {
    setIsLoading(false);
  }
}, [searchQuery]);


  // const generateContentWithGemini = async (query: string) => {
  //   try {
  //     const response = await fetch('/api/generate-content', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ query }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to generate content');
  //     }

  //     const data = await response.json();
  //     setGeneratedContent(data.content || []);
  //   } catch (error) {
  //     console.error('Error generating content with Gemini:', error);
  //     setGeneratedContent([]);
  //   }
  // };

  // Debounced search effect
  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (searchQuery.trim()) {
      setTypingTimeout(
        setTimeout(() => {
          handleSearch();
        }, 1000)
      );
    } else {
      setSearchResults([]);
      setGeneratedContent([]);
    }

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [searchQuery, filters, handleSearch]);

  const handleFilterToggle = (filterType: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const handleResultSelect = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setSearchQuery('');
    setSearchResults([]);
    setGeneratedContent([]);
  };

  const handleItemSelect = (item: SearchResult) => {
    setSelectedItem(item);
  };

  const fetchFullDetails = async (type: string, id: string) => {
    try {
      let tableName = '';
      switch (type) {
        case 'place':
          tableName = 'places';
          break;
        case 'hotel':
          tableName = 'hotels';
          break;
        case 'event':
          tableName = 'events';
          break;
        default:
          return null;
      }

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching details:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching details:', error);
      return null;
    }
  };

  const resultsToShow = searchResults.length > 0 ? searchResults : generatedContent;

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-12 py-3 border border-blue-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
          onFocus={() => setShowFilters(true)}
        />
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>
      
      {/* Filter Options */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4 z-50 border border-purple-200">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterToggle('places')}
              className={`px-3 py-1 rounded-full transition-all flex items-center text-sm ${filters.places ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              Places
              {filters.places && (
                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>
            
            <button
              onClick={() => handleFilterToggle('hotels')}
              className={`px-3 py-1 rounded-full transition-all flex items-center text-sm ${filters.hotels ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              Hotels
              {filters.hotels && (
                <span className="ml-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>
            
            <button
              onClick={() => handleFilterToggle('events')}
              className={`px-3 py-1 rounded-full transition-all flex items-center text-sm ${filters.events ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              Events
              {filters.events && (
                <span className="ml-1 bg-purple-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>
            
            <button
              onClick={() => handleFilterToggle('artisans')}
              className={`px-3 py-1 rounded-full transition-all flex items-center text-sm ${filters.artisans ? 'bg-teal-100 text-teal-700 border border-teal-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              Artisans
              {filters.artisans && (
                <span className="ml-1 bg-teal-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>
            
            <button
              onClick={() => handleFilterToggle('products')}
              className={`px-3 py-1 rounded-full transition-all flex items-center text-sm ${filters.products ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              Products
              {filters.products && (
                <span className="ml-1 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Search Results in Grid Layout */}
      {searchQuery && (
        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-6">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          ) : resultsToShow.length > 0 ? (
            <div>
              {generatedContent.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    No exact matches found. Here's some generated content about "{searchQuery}":
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {resultsToShow.map((result) => (
                  <div 
                    key={result.id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => handleItemSelect(result)}
                  >
                    {result.image ? (
                      <img 
                        src={result.image} 
                        alt={result.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-lg truncate">{result.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                          result.type === 'place' ? 'bg-blue-100 text-blue-800' :
                          result.type === 'hotel' ? 'bg-green-100 text-green-800' :
                          result.type === 'event' ? 'bg-purple-100 text-purple-800' :
                          result.type === 'artisan' ? 'bg-teal-100 text-teal-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {result.type}
                        </span>
                      </div>
                      {result.description && (
                        <p className="text-sm text-gray-700 line-clamp-2 mb-2">{result.description}</p>
                      )}
                      {result.rating && (
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {'★'.repeat(Math.round(result.rating))}
                            {'☆'.repeat(5 - Math.round(result.rating))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{result.rating.toFixed(1)}</span>
                        </div>
                      )}
                      {result.location && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {result.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
      
      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedItem.name}</h2>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                {selectedItem.image ? (
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center rounded-lg mb-4">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Details</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Type:</span> <span className="capitalize">{selectedItem.type}</span></p>
                      {selectedItem.description && (
                        <p><span className="font-medium">Description:</span> {selectedItem.description}</p>
                      )}
                      {selectedItem.location && (
                        <p><span className="font-medium">Location:</span> {selectedItem.location}</p>
                      )}
                      {selectedItem.rating && (
                        <p>
                          <span className="font-medium">Rating:</span> 
                          <span className="flex text-yellow-400 ml-1">
                            {'★'.repeat(Math.round(selectedItem.rating))}
                            {'☆'.repeat(5 - Math.round(selectedItem.rating))}
                          </span>
                          <span className="ml-2 text-gray-600">{selectedItem.rating.toFixed(1)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Additional Information</h3>
                    <div className="space-y-2">
                      {selectedItem.category && (
                        <p><span className="font-medium">Category:</span> {selectedItem.category}</p>
                      )}
                      {selectedItem.city && (
                        <p><span className="font-medium">City:</span> {selectedItem.city}</p>
                      )}
                      {selectedItem.start_date && (
                        <p><span className="font-medium">Start Date:</span> {new Date(selectedItem.start_date).toLocaleDateString()}</p>
                      )}
                      {selectedItem.end_date && (
                        <p><span className="font-medium">End Date:</span> {new Date(selectedItem.end_date).toLocaleDateString()}</p>
                      )}
                      {selectedItem.artisan && (
                        <p><span className="font-medium">Artisan:</span> {selectedItem.artisan}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}