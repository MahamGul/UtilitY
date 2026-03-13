import { MessageSquare, Users, CheckCircle, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    num: 1,
    title: "Post a Request",
    desc: "Describe the service you need with details and photos",
  },
  {
    icon: Users,
    num: 2,
    title: "Receive Offers",
    desc: "Get competitive bids from verified professionals nearby",
  },
  {
    icon: CheckCircle,
    num: 3,
    title: "Compare & Select",
    desc: "Review profiles, ratings, and prices to choose the best",
  },
  {
    icon: ThumbsUp,
    num: 4,
    title: "Get the Job Done",
    desc: "Enjoy quality service and rate your experience",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-section">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            How It Works
          </h2>
          <div className="w-14 h-1 rounded-full bg-primary mt-4" />
          <p className="mt-4 text-muted-foreground text-lg max-w-xl">
            Getting the help you need is simple and straightforward
          </p>
        </div>

        {/* Timeline style */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary/20 -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div
                key={step.num}
                className="relative bg-background rounded-2xl p-8 float-shadow-sm hover:float-shadow transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <step.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Step number */}
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center mb-4">
                  {step.num}
                </div>

                <h3 className="text-lg font-extrabold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
