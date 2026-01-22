import { type Offer, type Restaurant } from "@shared/schema";
import { Clock, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface OfferCardProps {
  offer: Offer & { restaurant?: Restaurant };
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary" />
      
      <div className="p-6 pl-8">
        {offer.restaurant && (
          <div className="text-xs font-bold text-primary/60 uppercase tracking-wider mb-2">
            {offer.restaurant.name}
          </div>
        )}
        
        <h3 className="font-display text-lg font-bold text-gray-900 mb-2">
          {offer.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {offer.description}
        </p>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            {offer.expiresAt 
              ? `Expires ${formatDistanceToNow(new Date(offer.expiresAt), { addSuffix: true })}` 
              : "Ongoing Offer"}
          </div>
          
          <button className="text-xs font-bold text-primary hover:text-secondary hover:underline transition-colors flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            Claim Offer
          </button>
        </div>
      </div>
    </div>
  );
}
