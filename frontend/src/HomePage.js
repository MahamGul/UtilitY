import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  UserCheck,
  ThumbsUp,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  User,
  Briefcase,
} from "lucide-react";
import { Button } from "./ui/button";

const howItWorksSteps = [
  {
    icon: MessageSquare,
    title: "Post a Request",
    description: "Describe the service you need with details and photos",
  },
  {
    icon: UserCheck,
    title: "Receive Offers",
    description: "Get competitive bids from verified professionals nearby",
  },
  {
    icon: CheckCircle2,
    title: "Compare & Select",
    description: "Review profiles, ratings, and prices to choose the best",
  },
  {
    icon: ThumbsUp,
    title: "Get the Job Done",
    description: "Enjoy quality service and rate your experience",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-foreground">
                UtilitY
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-accent px-6"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-primary text-white hover:bg-primary/90 shadow-md px-6">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-accent/30 via-background to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-12">
            <div className="space-y-8">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground">
                UtilitY
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
                Connecting You to Services that Matter
              </h2>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Your trusted marketplace for skilled professionals — plumbers,
                electricians, mechanics, and technicians
              </p>
            </div>

            {/* User Type Cards */}
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Link to="/login">
                <div className="bg-white rounded-2xl p-10 border-2 hover:border-primary hover:shadow-2xl transition-all group">
                  <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">I'm a Customer</h3>
                  <p className="text-muted-foreground mb-6">
                    Find trusted professionals to help with your service needs
                  </p>
                  <Button className="w-full">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </Link>

              <Link to="/login">
                <div className="bg-white rounded-2xl p-10 border-2 hover:border-primary hover:shadow-2xl transition-all group">
                  <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    I'm a Service Provider
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Grow your business by connecting with customers
                  </p>
                  <Button className="w-full">
                    Join as Professional
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto">
              <div>
                <div className="text-5xl font-bold text-primary">10K+</div>
                <div className="text-muted-foreground">Professionals</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary">50K+</div>
                <div className="text-muted-foreground">Jobs Completed</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary">4.8★</div>
                <div className="text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Getting the help you need is simple
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="bg-accent/30 rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm">
            © 2026 UtilitY. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Facebook />
            <Twitter />
            <Instagram />
            <Linkedin />
          </div>
        </div>
      </footer>
    </div>
  );
}
