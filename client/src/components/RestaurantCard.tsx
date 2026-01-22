import { Link } from "wouter";
import { MapPin, Star } from "lucide-react";
import { type Restaurant } from "@shared/schema";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  // Fallback image if no hero image is provided
  const bgImage = restaurant.heroImageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";

  return (
    <Link href={`/restaurant/${restaurant.id}`} className="group block h-full">
      <div className="relative h-full overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-border/40">
        
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          {restaurant.isFeatured && (
            <div className="absolute top-4 right-4 z-10 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
              Featured
            </div>
          )}
          
          <img
            src={bgImage}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Logo Overlay */}
          <div className="absolute -bottom-6 left-6 h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-white shadow-md">
            {restaurant.logoUrl ? (
              <img src={restaurant.logoUrl} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs font-bold text-gray-500">
                {restaurant.name.substring(0, 2)}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pt-8 pb-6 px-6">
          <h3 className="font-display text-xl font-bold text-primary mb-1 group-hover:text-secondary transition-colors">
            {restaurant.name}
          </h3>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span>{restaurant.city || "Treasure Coast"}, FL</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {restaurant.cuisine?.split(',').map((tag, i) => (
              <span 
                key={i} 
                className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
              >
                {tag.trim()}
              </span>
            )).slice(0, 3)}
          </div>
        </div>
      </div>
    </Link>
  );
}
