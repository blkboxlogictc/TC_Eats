import { useRestaurants } from "@/hooks/use-restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export function LatestListings() {
  const { data: restaurants, isLoading } = useRestaurants();

  // Get the latest restaurants (assuming newer ones have higher IDs or you could sort by createdAt)
  const latestRestaurants = restaurants
    ?.sort((a, b) => b.id - a.id) // Sort by ID descending to get newest first
    .slice(0, 6); // Show 6 latest listings

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-secondary" />
            <span className="text-secondary font-bold uppercase tracking-widest text-sm">
              Fresh Finds
            </span>
            <Sparkles className="h-5 w-5 text-secondary" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            Latest Listings
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the newest restaurants and dining experiences that have recently joined our community
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {latestRestaurants?.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* "New" Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      NEW
                    </div>
                  </div>
                  
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </motion.div>

            {/* View More Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link href="/directory">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="group border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 px-8 py-6 text-lg rounded-full"
                >
                  View All Restaurants
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}