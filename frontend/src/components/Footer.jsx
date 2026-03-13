import { Wrench, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Wrench className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-extrabold">
                Utilit<span className="text-primary">Y</span>
              </span>
            </div>
            <p className="text-sm opacity-60 max-w-xs leading-relaxed">
              Your trusted marketplace for skilled professionals.
            </p>
            <div className="flex gap-3 mt-6">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-extrabold text-lg mb-4">Services</h4>
            <div className="space-y-3">
              {["Plumbing", "Electrical", "Carpentry", "Mechanic", "Painting", "Cleaning"].map(
                (s) => (
                  <a key={s} href="#" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">
                    {s}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-extrabold text-lg mb-4">Company</h4>
            <div className="space-y-3">
              {["About Us", "How It Works", "Blog", "Careers", "Our Impact"].map(
                (l) => (
                  <a key={l} href="#" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">
                    {l}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-extrabold text-lg mb-4">Support</h4>
            <div className="space-y-3">
              {["Contact Us", "Help Center", "Safety", "Terms of Service", "Privacy Policy"].map(
                (l) => (
                  <a key={l} href="#" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">
                    {l}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-sm opacity-50">© 2026 UtilitY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
