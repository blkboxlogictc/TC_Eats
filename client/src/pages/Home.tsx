import { useRestaurants } from "@/hooks/use-restaurants";
import { usePublicOffers } from "@/hooks/use-offers";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { RestaurantCard } from "@/components/RestaurantCard";
import { OfferCard } from "@/components/OfferCard";
import { PatronForm } from "@/components/PatronForm";
import { EnhancedSearchBar } from "@/components/EnhancedSearchBar";
import { PlacesToDiscover } from "@/components/PlacesToDiscover";
import { MetricsSection } from "@/components/MetricsSection";
import { LatestListings } from "@/components/LatestListings";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ArrowRight, Search, Utensils, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants();
  const { data: offers, isLoading: loadingOffers } = usePublicOffers();
  const [, setLocation] = useLocation();

  // Get featured restaurants first, then fill with others
  const featuredRestaurants = restaurants
    ?.sort((a, b) => (Number(b.isFeatured) - Number(a.isFeatured)))
    .slice(0, 3);

  const handleSearch = (query: string, cuisine: string, location: string) => {
    console.log('Home handleSearch called:', { query, cuisine, location }); // Debug log
    
    // Navigate to map search with search parameters
    const params = new URLSearchParams();
    if (query && query.trim()) params.set('search', query.trim());
    
    // Only set cuisine if it's not the "all" option
    if (cuisine && cuisine !== 'all-cuisines' && cuisine !== 'All Cuisines') {
      params.set('cuisine', cuisine);
    }
    
    // Only set location if it's not the "all" option
    if (location && location !== 'all-locations' && location !== 'All Locations') {
      params.set('city', location);
    }
    
    const searchUrl = `/map-search${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('Navigating to:', searchUrl); // Debug log
    
    setLocation(searchUrl);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Unsplash Beach/Food Image */}
        {/* descriptive comment: A beautiful coastal dining table setting overlooking the ocean at sunset */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=2070&auto=format&fit=crop"
            alt="Coastal Dining"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
        </div>

        <div className="relative z-10 container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-white leading-tight">
              Discover Amazing <span className="text-secondary italic">Places</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 font-light">
              Find the best restaurants, bars, and dining experiences across the beautiful Treasure Coast.
              From waterfront dining to hidden gems, your next great meal awaits.
            </p>
          </motion.div>

          {/* Enhanced Search Bar */}
          <div className="max-w-6xl mx-auto mb-16">
            <EnhancedSearchBar onSearch={handleSearch} />
          </div>

        </div>
      </section>

      {/* Places to Discover Section */}
      <PlacesToDiscover />

      {/* Metrics Section */}
      <MetricsSection />

      {/* Featured Section */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-secondary font-bold uppercase tracking-widest text-sm">Our Picks</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mt-2">
                Featured Restaurants
              </h2>
            </div>
            <Link href="/directory">
              <Button variant="ghost" className="group text-primary mt-4 md:mt-0">
                View All Restaurants
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {loadingRestaurants ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredRestaurants?.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Listings Section */}
      <LatestListings />

      {/* Offers Ticker / Grid */}
      <section className="py-20 bg-white border-y border-border/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="bg-secondary/20 text-secondary-foreground px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              Limited Time
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mt-4">
              Exclusive Local Offers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers?.slice(0, 4).map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Patron Form Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Never Miss a <br /><span className="text-secondary">Delicious Deal</span>
              </h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Join our VIP club to receive weekly curated offers from the Treasure Coast's finest establishments.
                Be the first to know about new openings, secret menus, and chef specials.
              </p>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary/20 p-3 rounded-full">
                    <Utensils className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Curated Selection</h4>
                    <p className="text-sm text-white/60">Only the best local spots.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-secondary/20 p-3 rounded-full">
                    <Award className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Exclusive Savings</h4>
                    <p className="text-sm text-white/60">Deals you won't find anywhere else.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:pl-10">
              <PatronForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
