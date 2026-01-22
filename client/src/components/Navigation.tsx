import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X, ChefHat, UserCircle, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@assets/tclifestyle-logo-high-res-color-white-letters_1769118005447.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/directory", label: "Eat Local" },
    { href: "/offers", label: "Offers" },
  ];

  const homeSubLinks = [
    { href: "/about", label: "About Us" },
    { href: "/how-it-works", label: "How it Works" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || location !== "/"
          ? "bg-primary text-white shadow-md py-3"
          : "bg-transparent text-white py-5"
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img 
            src={logo} 
            alt="Treasure Coast Lifestyle" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium hover:text-secondary transition-colors uppercase tracking-wider flex items-center gap-1 outline-none">
              Home <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-primary border-white/10 text-white">
              <DropdownMenuItem asChild>
                <Link href="/" className="w-full cursor-pointer hover:bg-white/10">Home Page</Link>
              </DropdownMenuItem>
              {homeSubLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="w-full cursor-pointer hover:bg-white/10">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-secondary transition-colors uppercase tracking-wider"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-secondary hover:bg-white/10">
                  <ChefHat className="mr-2 h-4 w-4" />
                  Owner Portal
                </Button>
              </Link>
              <Button 
                onClick={() => logout()} 
                variant="outline" 
                className="border-white/30 text-primary bg-white hover:bg-secondary hover:border-secondary hover:text-primary-foreground"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <a href="/api/login">
              <Button className="bg-secondary text-primary-foreground hover:bg-secondary/90 font-bold shadow-lg shadow-black/20">
                <UserCircle className="mr-2 h-4 w-4" />
                Owner Login
              </Button>
            </a>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-primary border-t border-white/10 p-4 flex flex-col gap-4 shadow-xl">
          <Link href="/" className="text-white font-medium py-2 hover:text-secondary" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          {homeSubLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/80 font-medium py-1 pl-4 hover:text-secondary"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white font-medium py-2 hover:text-secondary"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-2" />
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                <span className="block text-white py-2">Owner Dashboard</span>
              </Link>
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="text-left text-white/70 py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <a href="/api/login" className="w-full">
              <Button className="w-full bg-secondary text-primary-foreground">
                Owner Login
              </Button>
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
