import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useRestaurants } from "@/hooks/use-restaurants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, List, Map as MapIcon, LocateFixed, X, Navigation2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { InteractiveMap } from "@/components/InteractiveMap";

// Mock coordinates for restaurants (in a real app, this would come from the database)
const getRestaurantCoordinates = (restaurant: any) => {
  const coordinates: Record<string, { lat: number; lng: number }> = {
    "Stuart": { lat: 27.1973, lng: -80.2528 },
    "Jensen Beach": { lat: 27.2295, lng: -80.2245 },
    "Palm City": { lat: 27.1662, lng: -80.2697 },
    "Jupiter": { lat: 26.9342, lng: -80.0942 },
    "Hobe Sound": { lat: 27.0581, lng: -80.1334 },
    "Vero Beach": { lat: 27.6386, lng: -80.3973 },
    "Fort Pierce": { lat: 27.4467, lng: -80.3256 },
    "Port St. Lucie": { lat: 27.2730, lng: -80.3582 },
    "Sebastian": { lat: 27.8164, lng: -80.4706 },
    "Hutchinson Island": { lat: 27.3364, lng: -80.2122 },
    "Tequesta": { lat: 26.9581, lng: -80.1028 }
  };
  
  return coordinates[restaurant.city] || { lat: 27.1973, lng: -80.2528 };
};

export default function MapSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [, setLocation] = useLocation();

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('search')) setSearchTerm(urlParams.get('search')!);
    if (urlParams.get('cuisine')) setSelectedCuisine(urlParams.get('cuisine')!);
    if (urlParams.get('city')) setSelectedCity(urlParams.get('city')!);
  }, []);
  
  const { data: restaurants, isLoading } = useRestaurants({
    search: searchTerm || undefined,
    city: selectedCity && selectedCity !== "all-cities" ? selectedCity : undefined,
    cuisine: selectedCuisine && selectedCuisine !== "all-cuisines" ? selectedCuisine : undefined
  });

  const filteredRestaurants = restaurants || [];

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
    "Indian"
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

  const getUserLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(location);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please try again.");
        setIsGettingLocation(false);
      }
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCuisine("");
    setSelectedCity("");
  };

  const hasFilters = searchTerm || (selectedCuisine && selectedCuisine !== "all-cuisines") || (selectedCity && selectedCity !== "all-cities");

  const openInMaps = (restaurant: any) => {
    const coords = getRestaurantCoordinates(restaurant);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
    window.open(mapsUrl, '_blank');
  };

  const handleRestaurantSelect = (restaurant: any) => {
    setLocation(`/restaurant/${restaurant.id}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Header */}
      <section className="bg-primary text-white pt-32 pb-8">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapIcon className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Map Search
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              Discover restaurants near you with location-based search. Find the perfect dining spot by proximity and preferences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Controls */}
      <section className="bg-white border-b border-border sticky top-[72px] z-30 shadow-sm">
        <div className="container-custom py-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search restaurants, cuisine..."
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Cuisine */}
            <div>
              <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {cuisines.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine === "All Cuisines" ? "all-cuisines" : cuisine}>
                      {cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city === "All Cities" ? "all-cities" : city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={getUserLocation}
                disabled={isGettingLocation}
                className="h-12 px-3"
                title="Use my location"
              >
                <LocateFixed className="h-4 w-4" />
              </Button>
              
              {hasFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-12 px-3"
                  title="Clear filters"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* View Toggle & Results */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              {isLoading ? "Loading..." : `${filteredRestaurants.length} restaurant${filteredRestaurants.length !== 1 ? 's' : ''} found`}
              {userLocation && (
                <span className="ml-4 text-green-600 font-medium">
                  📍 Your location enabled
                </span>
              )}
            </div>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8"
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="h-8"
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Map
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-8">
        <div className="container-custom">
          {isLoading ? (
            <div className={viewMode === "map" ? "h-[600px] bg-gray-100 rounded-lg animate-pulse" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
              {viewMode === "list" && [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <MapIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-display text-gray-700 mb-4">No restaurants found</h3>
              <p className="text-gray-500 mb-8">Try adjusting your search criteria or expanding your search area.</p>
              {hasFilters && (
                <Button onClick={clearFilters}>Clear All Filters</Button>
              )}
            </motion.div>
          ) : viewMode === "map" ? (
            <div className="h-[600px] w-full">
              <InteractiveMap
                restaurants={filteredRestaurants}
                userLocation={userLocation}
                onRestaurantSelect={handleRestaurantSelect}
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant, index) => {
                const coords = getRestaurantCoordinates(restaurant);
                return (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      <div className="relative">
                        {restaurant.heroImageUrl && (
                          <img
                            src={restaurant.heroImageUrl}
                            alt={restaurant.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        {restaurant.isFeatured && (
                          <Badge className="absolute top-2 left-2 bg-secondary text-primary">
                            Featured
                          </Badge>
                        )}
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openInMaps(restaurant)}
                            className="bg-white/90 hover:bg-white"
                            title="Open in maps"
                          >
                            <Navigation2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-primary group-hover:text-secondary transition-colors">
                              {restaurant.name}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{restaurant.cuisine}</p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {'$'.repeat(
                              restaurant.subscriptionTier === 'free' ? 1 :
                              restaurant.subscriptionTier === 'silver' ? 2 :
                              restaurant.subscriptionTier === 'gold' ? 3 : 4
                            )}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>
                        <div className="flex items-start gap-2 mb-4">
                          <MapIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-500">
                            {restaurant.address}, {restaurant.city} {restaurant.zip}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                          <Button
                            size="sm"
                            className="flex-1"
                            asChild
                          >
                            <Link href={`/restaurant/${restaurant.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openInMaps(restaurant)}
                            className="px-3"
                          >
                            <Navigation2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {userLocation && (
                          <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                            📍 Location-based search enabled
                            <br />
                            <span className="text-green-600">
                              Coordinates: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}