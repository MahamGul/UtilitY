import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import FairPriceSection from "./components/FairPriceSection";
import SafetySection from "./components/SafetySection";
import ServicesSection from "./components/ServicesSection";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FairPriceSection />
      <SafetySection />
      <ServicesSection />
      <Footer />
    </div>
  );
}