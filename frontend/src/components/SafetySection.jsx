import safetyImg from "../assets/safety.png";
import { ShieldCheck } from "lucide-react";

const SafetySection = () => {
  return (
    <section id="safety" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Safety First
          </h2>
          <div className="w-14 h-1 rounded-full bg-primary mt-4" />
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-lg">
            UtilitY prioritizes your safety above all. Every professional on our
            platform is verified and background-checked. We ensure secure
            payments, real-time tracking, and a rating system to keep quality
            high and trust higher.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="font-bold text-foreground">
              All Professionals Verified & Insured
            </span>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src={safetyImg}
            alt="Safety and verification"
            className="w-full max-w-sm animate-float"
          />
        </div>
      </div>
    </section>
  );
};

export default SafetySection;
