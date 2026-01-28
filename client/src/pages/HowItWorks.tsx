import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Search, MapPin, Gift, Star, Smartphone, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
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
              How It <span className="text-secondary italic">Works</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto">
              Discovering great food on the Treasure Coast is easier than ever. Here's how our platform works for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Steps */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            {[
              {
                step: "01",
                icon: <Search className="h-8 w-8" />,
                title: "Discover",
                description: "Browse our curated collection of the finest restaurants across the Treasure Coast. Use our advanced search to filter by cuisine, location, or dining style.",
                features: ["Advanced filtering", "Real-time updates", "Detailed reviews"]
              },
              {
                step: "02",
                icon: <Gift className="h-8 w-8" />,
                title: "Get Exclusive Deals",
                description: "Join our VIP community to receive special offers and discounts sent directly to your phone. Never miss out on limited-time promotions.",
                features: ["SMS notifications", "Exclusive discounts", "Member-only offers"]
              },
              {
                step: "03",
                icon: <Star className="h-8 w-8" />,
                title: "Enjoy & Share",
                description: "Visit your chosen restaurant and enjoy incredible food. Share your experience and help others discover hidden gems in our community.",
                features: ["Easy reservations", "Social sharing", "Community reviews"]
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="bg-secondary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                      <div className="text-primary">
                        {item.icon}
                      </div>
                    </div>
                    
                    <div className="text-6xl font-display font-bold text-secondary/30 mb-4">
                      {item.step}
                    </div>
                    
                    <h3 className="text-2xl font-display font-bold text-primary mb-4">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {item.description}
                    </p>

                    <ul className="space-y-2">
                      {item.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-500 flex items-center justify-center">
                          <div className="w-1 h-1 bg-secondary rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-3xl p-12 mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
                Why Choose Treasure Coast Restaurants?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We're more than just a restaurant directory. We're your local dining companion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <MapPin className="h-6 w-6" />,
                  title: "Local Focus",
                  description: "Exclusively Treasure Coast restaurants"
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Community Driven",
                  description: "Reviews by locals, for locals"
                },
                {
                  icon: <Smartphone className="h-6 w-6" />,
                  title: "Mobile Friendly",
                  description: "Perfect for on-the-go dining decisions"
                },
                {
                  icon: <Star className="h-6 w-6" />,
                  title: "Quality Curated",
                  description: "Only the best establishments featured"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="font-bold text-primary mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-3xl font-display font-bold text-primary mb-4">
              Ready to Start Your Culinary Journey?
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of food lovers who have discovered their new favorite restaurants through Treasure Coast Restaurants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/directory">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full">
                  <Search className="mr-2 h-5 w-5" />
                  Start Exploring
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg rounded-full">
                  Questions? Contact Us
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
