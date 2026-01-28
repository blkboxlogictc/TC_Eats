import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Utensils } from "lucide-react";
import { motion } from "framer-motion";

const cuisineTypes = [
  "All Cuisines",
  "American", 
  "Italian",
  "Seafood",
  "Mexican", 
  "Asian",
  "Mediterranean",
  "Steakhouse",
  "Caribbean",
  "French",
  "Indian"
];

const treasureCoastCities = [
  "All Locations",
  "Stuart",
  "Jensen Beach", 
  "Palm City",
  "Jupiter",
  "Hobe Sound",
  "Vero Beach",
  "Fort Pierce",
  "Port St. Lucie",
  "Sebastian",
  "Hutchinson Island",
  "Tequesta"
];

interface EnhancedSearchBarProps {
  onSearch?: (query: string, cuisine: string, location: string) => void;
}

export function EnhancedSearchBar({ onSearch }: EnhancedSearchBarProps) {
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    console.log('EnhancedSearchBar handleSearch triggered:', { query, cuisine, location });
    console.log('onSearch prop exists:', !!onSearch);
    
    if (onSearch) {
      console.log('About to call onSearch...');
      onSearch(query, cuisine, location);
      console.log('onSearch called successfully');
    } else {
      console.log('No onSearch prop provided!');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl shadow-black/20 border border-white/20"
      style={{ pointerEvents: 'auto', position: 'relative', zIndex: 9999, isolation: 'isolate' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ pointerEvents: 'auto' }}>
        {/* Search Input */}
        <div className="lg:col-span-1">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="What are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full pl-10 h-12 text-lg border-gray-200 focus:border-primary focus:ring-primary text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Cuisine Select */}
        <div className="lg:col-span-1">
          <div className="relative flex items-center">
            <Utensils className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <Select value={cuisine} onValueChange={setCuisine}>
              <SelectTrigger className="w-full pl-10 h-12 text-lg border-gray-200 focus:border-primary focus:ring-primary text-gray-900 bg-white">
                <SelectValue placeholder="Choose your category" />
              </SelectTrigger>
              <SelectContent>
                {cuisineTypes.map((type) => (
                  <SelectItem key={type} value={type === "All Cuisines" ? "all-cuisines" : type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location Select */}
        <div className="lg:col-span-1">
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full pl-10 h-12 text-lg border-gray-200 focus:border-primary focus:ring-primary text-gray-900 bg-white">
                <SelectValue placeholder="Where are you located?" />
              </SelectTrigger>
              <SelectContent>
                {treasureCoastCities.map((city) => (
                  <SelectItem key={city} value={city === "All Locations" ? "all-locations" : city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-1">
          <Button
            onClick={handleSearch}
            className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 rounded-xl"
            type="button"
          >
            Search Now
          </Button>
        </div>
      </div>
    </div>
  );
}