import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import logo from "@assets/tclifestyle-logo-high-res-color-white-letters_1769118005447.png";

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <img src={logo} alt="TC Lifestyle" className="h-12 w-auto mb-6" />
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Connecting locals and visitors with the best culinary experiences on the Treasure Coast.
              Eat, Play, Laugh, Live.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-secondary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-white/60 hover:text-secondary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-white/60 hover:text-secondary transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-bold mb-6 text-secondary">Discover</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/directory" className="hover:text-white transition-colors">Restaurants</Link></li>
              <li><Link href="/offers" className="hover:text-white transition-colors">Exclusive Offers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Local Stories</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* For Restaurants */}
          <div>
            <h3 className="text-lg font-display font-bold mb-6 text-secondary">Partners</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href="/api/login" className="hover:text-white transition-colors">Owner Login</a></li>
              <li><Link href="/join" className="hover:text-white transition-colors">Add Your Restaurant</Link></li>
              <li><Link href="/advertising" className="hover:text-white transition-colors">Advertising</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-display font-bold mb-6 text-secondary">Contact Us</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0" />
                <span>123 Ocean Drive,<br />Stuart, FL 34994</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <span>(772) 555-0123</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span>hello@tclifestyle.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} Treasure Coast Lifestyle. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
