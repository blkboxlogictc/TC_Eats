import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OfferCard } from "@/components/OfferCard";
import { usePublicOffers } from "@/hooks/use-offers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Loader2, Gift, Clock, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";

const offerCategories = [
  "All Offers",
  "Food & Drink",
  "Happy Hour", 
  "Weekend Special",
  "Lunch Deal",
  "Dinner Special",
  "Appetizer",
  "Dessert",
  "Group Discount"
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

export default function Offers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { data: allOffers, isLoading } = usePublicOffers();

  // Filter offers based on search criteria
  const filteredOffers = allOffers?.filter(offer => {
    const matchesSearch = !searchTerm || 
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For demo purposes, we'll use simple keyword matching for categories
    const matchesCategory = !selectedCategory || selectedCategory === "all-offers" ||
      offer.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      offer.description.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  }) || [];

  const activeOffers = filteredOffers.filter(offer => {
    if (!offer.expiresAt) return true;
    return new Date(offer.expiresAt) > new Date();
  });

  const expiringSoon = activeOffers.filter(offer => {
    if (!offer.expiresAt) return false;
    const expiryDate = new Date(offer.expiresAt);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return expiryDate <= threeDaysFromNow;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-secondary via-secondary/90 to-orange-400 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", 
              backgroundSize: "30px 30px" 
            }}
          />
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-primary/20 p-4 rounded-full">
                <Gift className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary mb-6">
              Exclusive <span className="text-primary italic">Offers</span>
            </h1>
            <p className="text-primary/80 text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Discover amazing deals and limited-time offers from the best restaurants across the Treasure Coast. 
              Save money while enjoying incredible dining experiences.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary">{activeOffers.length}</div>
                <p className="text-sm text-primary/70">Active Offers</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary">{expiringSoon.length}</div>
                <p className="text-sm text-primary/70">Ending Soon</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary">25%</div>
                <p className="text-sm text-primary/70">Avg. Savings</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary">New</div>
                <p className="text-sm text-primary/70">Weekly Deals</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-white sticky top-[72px] z-30 shadow-sm">
        <div className="container-custom py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search offers, restaurants, deals..."
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-[200px] h-12">
                <SelectValue placeholder="Offer Category" />
              </SelectTrigger>
              <SelectContent>
                {offerCategories.map((category) => (
                  <SelectItem key={category} value={category === "All Offers" ? "all-offers" : category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full lg:w-[180px] h-12">
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
        </div>
      </section>

      {/* Expiring Soon Section */}
      {expiringSoon.length > 0 && (
        <section className="py-12 bg-red-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <div className="flex justify-center items-center gap-2 mb-4">
                <Clock className="h-6 w-6 text-red-600" />
                <Badge variant="destructive" className="bg-red-600">
                  Ending Soon
                </Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-2">
                Don't Miss Out!
              </h2>
              <p className="text-gray-600">These offers are expiring within 3 days</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {expiringSoon.slice(0, 4).map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge variant="destructive" className="bg-red-600 animate-pulse">
                      Hurry!
                    </Badge>
                  </div>
                  <OfferCard offer={offer} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Offers Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
                All Current Offers
              </h2>
              <p className="text-gray-600">
                {isLoading ? "Loading offers..." : `${filteredOffers.length} offer${filteredOffers.length !== 1 ? 's' : ''} available`}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link href="/directory">
                <Button variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Browse Restaurants
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredOffers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Gift className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-display text-gray-700 mb-4">No offers found</h3>
              <p className="text-gray-500 mb-8">
                {searchTerm || selectedCategory ? 
                  "Try adjusting your search or browse all offers." : 
                  "Check back soon for new deals and offers."
                }
              </p>
              {(searchTerm || selectedCategory) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setSelectedCity("");
                  }}
                >
                  View All Offers
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <OfferCard offer={offer} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Star className="h-10 w-10 text-primary" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              Want to feature your restaurant's offers?
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Join hundreds of local restaurants already attracting more customers through our platform. 
              Showcase your deals and connect with food lovers across the Treasure Coast.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full">
                  Partner With Us
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg rounded-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}