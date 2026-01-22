import { useRestaurants } from "@/hooks/use-restaurants";
import { usePublicOffers } from "@/hooks/use-offers";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { RestaurantCard } from "@/components/RestaurantCard";
import { OfferCard } from "@/components/OfferCard";
import { PatronForm } from "@/components/PatronForm";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Search, Utensils, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants();
  const { data: offers, isLoading: loadingOffers } = usePublicOffers();

  // Get featured restaurants first, then fill with others
  const featuredRestaurants = restaurants
    ?.sort((a, b) => (Number(b.isFeatured) - Number(a.isFeatured)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
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

        <div className="relative z-10 container-custom text-center text-white pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-white leading-tight">
              Eat. Play. <span className="text-secondary italic">Live.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light">
              Discover the hidden gems and culinary treasures of the Treasure Coast. 
              From Stuart to Vero Beach, we curate the best local experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/directory">
                <Button size="lg" className="bg-secondary text-primary hover:bg-white hover:text-primary font-bold px-8 py-6 text-lg shadow-xl shadow-black/20 rounded-full">
                  Find a Table
                </Button>
              </Link>
              <Link href="/offers">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white px-8 py-6 text-lg rounded-full backdrop-blur-sm">
                  View Offers
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto text-background fill-current">
            <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

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
