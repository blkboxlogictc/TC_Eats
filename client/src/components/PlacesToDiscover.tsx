import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  {
    id: 1,
    title: "Seafood Restaurants",
    description: "Fresh catches from the Atlantic",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=400",
    count: "89 Places"
  },
  {
    id: 2,
    title: "Waterfront Dining",
    description: "Dine with stunning water views",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400",
    count: "56 Places"
  },
  {
    id: 3,
    title: "Fine Dining",
    description: "Upscale culinary experiences",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400",
    count: "34 Places"
  },
  {
    id: 4,
    title: "Casual Eats",
    description: "Relaxed dining for any occasion",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400",
    count: "127 Places"
  },
  {
    id: 5,
    title: "Beach Bars",
    description: "Cold drinks with sandy feet",
    image: "https://images.unsplash.com/photo-1502301103675-91d57632d076?auto=format&fit=crop&q=80&w=400",
    count: "42 Places"
  },
  {
    id: 6,
    title: "Brunch Spots",
    description: "Perfect weekend morning meals",
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=400",
    count: "38 Places"
  }
];

export function PlacesToDiscover() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance the carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Get visible categories (show 3 at a time on desktop, 1 on mobile)
  const getVisibleCategories = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % categories.length;
      visible.push(categories[index]);
    }
    return visible;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-primary font-bold uppercase tracking-widest text-sm">
            Explore
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mt-2 mb-4">
            Places to Discover
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From beachside bars to elegant dining rooms, explore the diverse culinary landscape of the Treasure Coast
          </p>
        </div>

        <div className="relative">
          {/* Desktop View - 3 cards */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-6">
              {getVisibleCategories().map((category, index) => (
                <motion.div
                  key={`${category.id}-${currentIndex}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                      <CardContent className="p-0">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={category.image}
                            alt={category.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                            <h3 className="font-bold text-xl mb-2">{category.title}</h3>
                            <p className="text-white/90 text-sm mb-2">{category.description}</p>
                            <span className="text-secondary font-medium text-sm">{category.count}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile View - 1 card */}
          <div className="md:hidden">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg mx-4">
                    <CardContent className="p-0">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={categories[currentIndex].image}
                          alt={categories[currentIndex].title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                          <h3 className="font-bold text-xl mb-2">{categories[currentIndex].title}</h3>
                          <p className="text-white/90 text-sm mb-2">{categories[currentIndex].description}</p>
                          <span className="text-secondary font-medium text-sm">{categories[currentIndex].count}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg z-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg z-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-primary w-8" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}