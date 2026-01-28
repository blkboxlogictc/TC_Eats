import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, DollarSign, Utensils, Filter, X, LocateFixed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterState {
  search: string;
  county: string;
  city: string;
  cuisine: string;
  diningTypes: string[];
  priceRange: string;
  distance: number;
  useLocation: boolean;
  userLocation: { lat: number; lng: number } | null;
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const counties = [
  "All Counties",
  "Martin County",
  "St. Lucie County", 
  "Indian River County",
  "Palm Beach County"
];

const cities = [
  "All Cities",
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

const cuisines = [
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
  "Indian",
  "Thai",
  "Japanese",
  "BBQ",
  "Pizza"
];

const diningTypes = [
  { id: "catering", label: "Catering" },
  { id: "delivery", label: "Delivery" },
  { id: "takeout", label: "Take-Out" },
  { id: "dinein", label: "Dine In" },
  { id: "drivethru", label: "Drive Thru" },
  { id: "ghostkitchen", label: "Ghost Kitchen" }
];

const priceRanges = [
  { value: "all", label: "All Prices", symbol: "" },
  { value: "1", label: "Inexpensive", symbol: "$" },
  { value: "2", label: "Moderate", symbol: "$$" },
  { value: "3", label: "Expensive", symbol: "$$$" },
  { value: "4", label: "Ultra High", symbol: "$$$$" }
];

export function AdvancedFilters({ filters, onFiltersChange, isOpen, onToggle }: AdvancedFiltersProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleDiningTypeChange = (typeId: string, checked: boolean) => {
    const newDiningTypes = checked 
      ? [...filters.diningTypes, typeId]
      : filters.diningTypes.filter(id => id !== typeId);
    
    handleFilterChange('diningTypes', newDiningTypes);
  };

  const getUserLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        handleFilterChange('userLocation', location);
        handleFilterChange('useLocation', true);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please try again.");
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      county: "",
      city: "",
      cuisine: "",
      diningTypes: [],
      priceRange: "",
      distance: 25,
      useLocation: false,
      userLocation: null
    });
  };

  const hasActiveFilters = filters.search || filters.county || filters.city || 
                          filters.cuisine || filters.diningTypes.length > 0 || 
                          filters.priceRange || filters.useLocation;

  return (
    <div className="border-b border-border bg-white sticky top-[72px] z-30 shadow-sm">
      <div className="container-custom">
        {/* Basic Filters Row */}
        <div className="py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search restaurants, cuisine, dishes..." 
                className="pl-10 h-12"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 lg:gap-4">
              <Select value={filters.county} onValueChange={(value) => handleFilterChange('county', value)}>
                <SelectTrigger className="w-[140px] h-12">
                  <SelectValue placeholder="County" />
                </SelectTrigger>
                <SelectContent>
                  {counties.map((county) => (
                    <SelectItem key={county} value={county === "All Counties" ? "" : county}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
                <SelectTrigger className="w-[140px] h-12">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city === "All Cities" ? "" : city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={onToggle}
                className="h-12 gap-2"
              >
                <Filter className="h-4 w-4" />
                More Filters
                {hasActiveFilters && (
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {[filters.county, filters.city, filters.cuisine, filters.priceRange, 
                      ...(filters.diningTypes.length > 0 ? ['dining'] : []), 
                      ...(filters.useLocation ? ['location'] : [])]
                      .filter(Boolean).length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pb-6 pt-2">
                <Card className="border-0 bg-gray-50">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                      
                      {/* Cuisine Filter */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Utensils className="h-4 w-4" />
                          Cuisine Type
                        </Label>
                        <Select value={filters.cuisine} onValueChange={(value) => handleFilterChange('cuisine', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cuisine" />
                          </SelectTrigger>
                          <SelectContent>
                            {cuisines.map((cuisine) => (
                              <SelectItem key={cuisine} value={cuisine === "All Cuisines" ? "" : cuisine}>
                                {cuisine}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Dining Types */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">
                          Service Type
                        </Label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {diningTypes.map((type) => (
                            <div key={type.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={type.id}
                                checked={filters.diningTypes.includes(type.id)}
                                onCheckedChange={(checked) => handleDiningTypeChange(type.id, !!checked)}
                              />
                              <Label htmlFor={type.id} className="text-sm text-gray-600">
                                {type.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Price Range
                        </Label>
                        <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            {priceRanges.map((range) => (
                              <SelectItem key={range.value} value={range.value === "all" ? "" : range.value}>
                                <div className="flex items-center gap-2">
                                  {range.symbol && (
                                    <span className="font-bold text-green-600">{range.symbol}</span>
                                  )}
                                  <span>{range.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Location & Distance */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Distance from You
                        </Label>
                        
                        {!filters.useLocation ? (
                          <Button 
                            variant="outline" 
                            onClick={getUserLocation}
                            disabled={isGettingLocation}
                            className="w-full"
                          >
                            <LocateFixed className="h-4 w-4 mr-2" />
                            {isGettingLocation ? "Getting location..." : "Use My Location"}
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Within {filters.distance} miles</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  handleFilterChange('useLocation', false);
                                  handleFilterChange('userLocation', null);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <Slider
                              value={[filters.distance]}
                              onValueChange={(value) => handleFilterChange('distance', value[0])}
                              min={1}
                              max={120}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>1 mi</span>
                              <span>120 mi</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        {hasActiveFilters ? "Active filters applied" : "No filters applied"}
                      </div>
                      <div className="flex gap-2">
                        {hasActiveFilters && (
                          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                            Clear All
                          </Button>
                        )}
                        <Button size="sm" onClick={onToggle}>
                          Done
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}