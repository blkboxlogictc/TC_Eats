import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Utensils, Users, Wine, Heart } from "lucide-react";

interface Metric {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
}

const metrics: Metric[] = [
  {
    icon: <Utensils className="h-8 w-8" />,
    value: 470,
    label: "Restaurants",
    suffix: ""
  },
  {
    icon: <Users className="h-8 w-8" />,
    value: 18,
    label: "Company Staff",
    suffix: ""
  },
  {
    icon: <Wine className="h-8 w-8" />,
    value: 64,
    label: "Bar & Nightclubs",
    suffix: ""
  },
  {
    icon: <Heart className="h-8 w-8" />,
    value: 91761,
    label: "Happy People",
    suffix: ""
  }
];

function CountUp({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          
          const startTime = Date.now();
          const startValue = 0;
          
          const updateCount = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smoother animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuart);
            
            setCount(currentValue);
            
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            }
          };
          
          updateCount();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasStarted]);

  return (
    <div ref={elementRef} className="text-4xl md:text-5xl font-bold text-white">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export function MetricsSection() {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
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
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Treasure Coast by the Numbers
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Connecting food lovers with the best dining experiences across the Treasure Coast
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-secondary">
                  {metric.icon}
                </div>
              </div>
              
              <CountUp 
                end={metric.value} 
                duration={2000 + index * 200} 
                suffix={metric.suffix} 
              />
              
              <p className="text-white/80 mt-2 font-medium">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional decorative elements */}
        <div className="flex justify-center mt-16">
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                viewport={{ once: true }}
                className="w-2 h-2 bg-secondary rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}