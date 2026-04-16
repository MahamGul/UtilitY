import { ThumbsUp, Users, Smile } from "lucide-react";

const features = [
  {
    icon: ThumbsUp,
    title: "Fair Pricing",
    desc: "You set the price you're willing to pay. Professionals bid competitively, so you always get a fair deal without hidden fees.",
  },
  {
    icon: Users,
    title: "Your Choice",
    desc: "Browse profiles, read reviews, and choose the professional that best fits your needs. Full transparency puts you in control.",
  },
  {
    icon: Smile,
    title: "Quality Guaranteed",
    desc: "Every professional is verified and rated. Our quality assurance ensures you get reliable, skilled service every time.",
  },
];

const FairPriceSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground max-w-2xl mx-auto leading-snug">
          Because <span className="text-primary">A Fair Price</span> Is
          Something <span className="text-primary">You Can Offer</span>, Not Hope For
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 -mb-20 relative z-10">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border-2 border-primary/20 bg-background p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 float-shadow-sm"
            >
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-5">
                <f.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-extrabold text-foreground mb-3">
                <span className="text-primary">{f.title.split(" ")[0]}</span>{" "}
                {f.title.split(" ").slice(1).join(" ")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FairPriceSection;
