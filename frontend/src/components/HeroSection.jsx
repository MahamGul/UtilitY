import heroImg from "../assets/hero-illustration.png";
import { ArrowRight, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="text-gradient">Connecting You</span>
            <br />
            <span className="text-foreground">To Services That</span>
            <br />
            <span className="text-foreground">Matter</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Your trusted marketplace for skilled professionals — plumbers,
            electricians, mechanics, and technicians
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#"
              className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-all hover:scale-105 float-shadow inline-flex items-center justify-center"
            >
              Get Started <ArrowRight className="w-6 h-6 ml-1 translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 rounded-full border-2 border-primary text-primary font-bold text-base hover:bg-accent transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex-1 flex justify-center">
          <img
            src={heroImg}
            alt="Service professional with app"
            className="w-full max-w-lg lg:max-w-xl animate-float drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-5xl mx-auto mt-16 md:mt-24">
        <div className="rounded-3xl border-2 border-primary/20 bg-accent/30 p-8 md:p-10">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: "10K+", label: "Professionals" },
              { value: "50K+", label: "Jobs Completed" },
              { value: "4.8", label: "Average Rating", icon: true },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-extrabold text-primary flex items-center justify-center gap-1">
                  {stat.value}
                  {stat.icon && <Star className="w-6 h-6 fill-primary text-primary" />}
                </p>
                <p className="text-sm md:text-base font-semibold text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission statement - outside the box */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-center leading-snug mt-10">
          Connecting <span className="text-primary">skilled professionals</span> with people
          <br className="hidden md:block" />
          who need them — <span className="text-primary">everywhere, for everyone</span>.
        </h2>
      </div>
    </section>
  );
};

export default HeroSection;
