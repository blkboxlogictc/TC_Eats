import { useState } from "react";
import { useRestaurants } from "@/hooks/use-restaurants";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";

export default function Directory() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState<string>("");
  const [cuisine, setCuisine] = useState<string>("");

  // Debounce search ideally, but for MVP simple state works
  const { data: restaurants, isLoading } = useRestaurants({ 
    search: search || undefined,
    city: city && city !== "all" ? city : undefined,
    cuisine: cuisine && cuisine !== "all" ? cuisine : undefined
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Header */}
      <div className="bg-primary text-white pt-32 pb-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Local Eats Directory</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Browse our curated list of the best restaurants, cafes, and bars on the Treasure Coast.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-white sticky top-[72px] z-30 shadow-sm">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search restaurants..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="Stuart">Stuart</SelectItem>
                <SelectItem value="Jensen Beach">Jensen Beach</SelectItem>
                <SelectItem value="Port St. Lucie">Port St. Lucie</SelectItem>
                <SelectItem value="Vero Beach">Vero Beach</SelectItem>
                <SelectItem value="Fort Pierce">Fort Pierce</SelectItem>
              </SelectContent>
            </Select>

            <Select value={cuisine} onValueChange={setCuisine}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                <SelectItem value="Seafood">Seafood</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="Asian">Asian</SelectItem>
                <SelectItem value="Steakhouse">Steakhouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 container-custom py-12">
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
