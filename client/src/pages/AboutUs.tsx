import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, Users, Heart, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-primary overflow-hidden">
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
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              About <span className="text-secondary italic">Treasure Coast Restaurants</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto">
              Your premier destination for discovering the best dining experiences across the beautiful Treasure Coast
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Welcome to Treasure Coast Restaurants, where passion for great food meets the natural beauty of Florida's Treasure Coast.
                We're more than just a restaurant directory – we're your trusted culinary companions on a journey through
                the most exciting dining experiences our coastal community has to offer.
              </p>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Founded by locals for locals, our mission is simple: to connect food enthusiasts with incredible restaurants
                that make the Treasure Coast a unique culinary destination. Whether you're a lifelong resident or just
                visiting our shores, we help you find the perfect spot for any occasion.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                From casual beachside bites to elegant waterfront dining, we curate only the finest establishments
                to ensure you always have a seat at the best tables in town.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600"
                alt="Coastal dining experience"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl" />
            </motion.div>
          </div>

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Local Love",
                description: "We're passionate about supporting local businesses and showcasing what makes our community special."
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: "Quality First",
                description: "Every restaurant in our directory is carefully selected for exceptional food, service, and atmosphere."
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Community Driven",
                description: "Built by locals for locals, we understand what our community values in a great dining experience."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <div className="text-primary">
                        {value.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center bg-gray-50 rounded-3xl p-12"
          >
            <h3 className="text-3xl font-display font-bold text-primary mb-4">
              Ready to Explore?
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of food lovers who trust Treasure Coast Restaurants to guide them to their next great meal.
              Discover what the Treasure Coast has to offer today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/directory">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Restaurants
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg rounded-full">
                  Get in Touch
                  <ArrowRight className="ml-2 h-5 w-5" />
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
