import { useRoute } from "wouter";
import { useRestaurant } from "@/hooks/use-restaurants";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OfferCard } from "@/components/OfferCard";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Globe, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function RestaurantDetail() {
  const [match, params] = useRoute("/restaurant/:id");
  const id = params ? parseInt(params.id) : 0;
  
  const { data: restaurant, isLoading } = useRestaurant(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Restaurant Not Found</h1>
        <Link href="/directory"><Button>Back to Directory</Button></Link>
      </div>
    );
  }

  // Fallback hero
  const heroImage = restaurant.heroImageUrl || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img 
          src={heroImage} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white bg-gradient-to-t from-black/80 to-transparent">
          <div className="container-custom">
            <Link href="/directory" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
            </Link>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
              {restaurant.city && (
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-secondary" /> {restaurant.address}, {restaurant.city}</span>
              )}
              {restaurant.cuisine && (
                <span className="bg-secondary/20 px-3 py-1 rounded-full text-secondary font-semibold">{restaurant.cuisine}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* About */}
          <section>
            <h2 className="text-2xl font-display font-bold text-primary mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {restaurant.description || "No description provided."}
            </p>
          </section>

          {/* Offers */}
          <section>
            <h2 className="text-2xl font-display font-bold text-primary mb-6">Current Offers</h2>
            {restaurant.offers && restaurant.offers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurant.offers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
                <p className="text-muted-foreground">No active offers at the moment. Check back soon!</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-border">
            <h3 className="font-display font-bold text-xl mb-6">Info & Contact</h3>
            <ul className="space-y-4">
              {restaurant.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-muted-foreground uppercase">Phone</span>
                    <a href={`tel:${restaurant.phone}`} className="hover:text-primary hover:underline">{restaurant.phone}</a>
                  </div>
                </li>
              )}
              {restaurant.website && (
                <li className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-muted-foreground uppercase">Website</span>
                    <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline truncate block max-w-[200px]">
                      Visit Website
                    </a>
                  </div>
                </li>
              )}
              {restaurant.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-muted-foreground uppercase">Address</span>
                    <span>{restaurant.address}<br />{restaurant.city}, {restaurant.zip}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
