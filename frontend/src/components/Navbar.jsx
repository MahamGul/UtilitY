import { Wrench, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-18 py-4">

        <a href="#" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-heading tracking-tight text-foreground">
            Utilit<span className="text-primary">Y</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">How It Works</a>
          <a href="#services" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Services</a>
          <a href="#about-us" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">About Us</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity text-center min-w-[150px]">
            Find a Service
          </Link>
          <Link to="/login" className="px-6 py-2.5 rounded-full border-2 border-primary text-primary bg-background font-semibold text-sm hover:bg-accent transition-colors text-center min-w-[150px]">
            Become a Provider
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-6 py-4 space-y-3">
          <a href="#how-it-works" className="block text-sm font-semibold text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>How It Works</a>
          <a href="#services" className="block text-sm font-semibold text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Services</a>
          <a href="#about-us" className="block text-sm font-semibold text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>About Us</a>
          <div className="flex flex-col gap-2 pt-2">
            <Link to="/login" className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm text-center" onClick={() => setMobileOpen(false)}>
              Find a Service
            </Link>
            <Link to="/login" className="px-5 py-2.5 rounded-full border-2 border-primary text-primary bg-background font-semibold text-sm text-center" onClick={() => setMobileOpen(false)}>
              Become a Provider
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
