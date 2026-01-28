import { useState } from "react";
import { useRestaurants } from "@/hooks/use-restaurants";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Loader2, X, MapPin, LocateFixed, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const counties = [
  "All Counties",
  "Martin County",
  "St. Lucie County",
  "Indian River County",
  "Palm Beach County"
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

export default function Directory() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState<string>("");
  const [cuisine, setCuisine] = useState<string>("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  
  // Advanced filter states
  const [county, setCounty] = useState("");
  const [selectedDiningTypes, setSelectedDiningTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("");
  const [distance, setDistance] = useState(25);
  const [useLocation, setUseLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { data: restaurants, isLoading } = useRestaurants({
    search: search || undefined,
    city: city && city !== "all-cities" ? city : undefined,
    cuisine: cuisine && cuisine !== "all-cuisines" ? cuisine : undefined
  });

  const handleDiningTypeChange = (typeId: string, checked: boolean) => {
    setSelectedDiningTypes(prev =>
      checked ? [...prev, typeId] : prev.filter(id => id !== typeId)
    );
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
        setUserLocation(location);
        setUseLocation(true);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please try again.");
        setIsGettingLocation(false);
      }
    );
  };

  const clearAllFilters = () => {
    setSearch("");
    setCity("");
    setCuisine("");
    setCounty("");
    setSelectedDiningTypes([]);
    setPriceRange("");
    setDistance(25);
    setUseLocation(false);
    setUserLocation(null);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (search) count++;
    if (city && city !== "all-cities") count++;
    if (cuisine && cuisine !== "all-cuisines") count++;
    if (county && county !== "all-counties") count++;
    if (selectedDiningTypes.length > 0) count++;
    if (priceRange && priceRange !== "all-prices") count++;
    if (useLocation) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Header */}
      <div className="bg-primary text-white pt-32 pb-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Eat Local</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Discover amazing restaurants, cafes, and bars across the Treasure Coast.
            Filter by location, cuisine, and more to find your perfect dining experience.
          </p>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="border-b border-border bg-white sticky top-[72px] z-30 shadow-sm">
        <div className="container-custom py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search restaurants, cuisine, dishes..."
                className="pl-10 h-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-full lg:w-[180px] h-12">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-cities">All Cities</SelectItem>
                <SelectItem value="Stuart">Stuart</SelectItem>
                <SelectItem value="Jensen Beach">Jensen Beach</SelectItem>
                <SelectItem value="Palm City">Palm City</SelectItem>
                <SelectItem value="Jupiter">Jupiter</SelectItem>
                <SelectItem value="Hobe Sound">Hobe Sound</SelectItem>
                <SelectItem value="Vero Beach">Vero Beach</SelectItem>
                <SelectItem value="Fort Pierce">Fort Pierce</SelectItem>
                <SelectItem value="Port St. Lucie">Port St. Lucie</SelectItem>
                <SelectItem value="Sebastian">Sebastian</SelectItem>
                <SelectItem value="Hutchinson Island">Hutchinson Island</SelectItem>
                <SelectItem value="Tequesta">Tequesta</SelectItem>
              </SelectContent>
            </Select>

            <Select value={cuisine} onValueChange={setCuisine}>
              <SelectTrigger className="w-full lg:w-[180px] h-12">
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-cuisines">All Cuisines</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Seafood">Seafood</SelectItem>
                <SelectItem value="Mexican">Mexican</SelectItem>
                <SelectItem value="Asian">Asian</SelectItem>
                <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                <SelectItem value="Steakhouse">Steakhouse</SelectItem>
                <SelectItem value="Caribbean">Caribbean</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="Thai">Thai</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="BBQ">BBQ</SelectItem>
                <SelectItem value="Pizza">Pizza</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="h-12 px-6 gap-2"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
              <Filter className="h-4 w-4" />
              More Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showMoreFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="container-custom py-6">
                <Card className="border-0 bg-gray-50">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Advanced Filters</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setShowMoreFilters(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                      
                      {/* County Filter */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          County
                        </Label>
                        <Select value={county} onValueChange={setCounty}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select county" />
                          </SelectTrigger>
                          <SelectContent>
                            {counties.map((c) => (
                              <SelectItem key={c} value={c === "All Counties" ? "all-counties" : c}>
                                {c}
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
                                checked={selectedDiningTypes.includes(type.id)}
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
                        <Select value={priceRange} onValueChange={setPriceRange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            {priceRanges.map((range) => (
                              <SelectItem key={range.value} value={range.value === "all" ? "all-prices" : range.value}>
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
                        <Label className="text-sm font-semibold text-gray-700">
                          Distance from You
                        </Label>
                        
                        {!useLocation ? (
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
                              <span>Within {distance} miles</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setUseLocation(false);
                                  setUserLocation(null);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <Slider
                              value={[distance]}
                              onValueChange={(value) => setDistance(value[0])}
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
                        {getActiveFilterCount() > 0 ? `${getActiveFilterCount()} active filter${getActiveFilterCount() !== 1 ? 's' : ''}` : "No filters applied"}
                      </div>
                      <div className="flex gap-2">
                        {getActiveFilterCount() > 0 && (
                          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                            Clear All
                          </Button>
                        )}
                        <Button size="sm" onClick={() => setShowMoreFilters(false)}>
                          Apply Filters
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

      {/* Results Header */}
      <div className="container-custom py-6">
        <h2 className="text-2xl font-display font-bold text-primary">
          {isLoading ? "Loading..." : `${restaurants?.length || 0} Restaurant${restaurants?.length !== 1 ? 's' : ''} Found`}
        </h2>
      </div>

      {/* Grid */}
      <div className="flex-1 container-custom pb-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : restaurants?.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-display text-muted-foreground">No restaurants found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants?.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
