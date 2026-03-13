import plumberImg from "../assets/plumber.png";
import electricianImg from "../assets/electrician.png";
import carpenterImg from "../assets/carpenter.png";
import mechanicImg from "../assets/mechanic.png";
import { ArrowRight } from "lucide-react";

const services = [
  {
    img: plumberImg,
    title: "Plumbing",
    desc: "Find expert plumbers for repairs, installation & maintenance",
  },
  {
    img: electricianImg,
    title: "Electrical",
    desc: "Licensed electricians for wiring, repairs & installations",
  },
  {
    img: carpenterImg,
    title: "Carpentry",
    desc: "Skilled carpenters for furniture, repairs & custom work",
  },
  {
    img: mechanicImg,
    title: "Mechanic",
    desc: "Professional mechanics for vehicle repairs & servicing",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Our Services
          </h2>
          <div className="w-14 h-1 rounded-full bg-primary mt-4" />
          <p className="mt-4 text-muted-foreground text-lg max-w-xl">
            Post your request, get offers from verified professionals, and
            choose the best deal
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s) => (
            <div
              key={s.title}
              className="flex h-full flex-col items-center text-center group"
            >
              <div className="h-60 md:h-64 w-full flex items-end justify-center">
                <img
                  src={s.img}
                  alt={s.title}
                  className="h-full w-full max-w-[15rem] object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4 flex flex-col flex-1">
                <h3 className="font-extrabold text-lg text-foreground">
                  <span className="text-primary">{s.title}</span> Services
                </h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed flex-1">
                  {s.desc}
                </p>
                <a
                  href="#"
                  className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity self-center"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
