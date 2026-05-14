import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Users, Target, Award, Heart, Gift, Sparkles, 
  Shirt, Droplet, Star, TrendingUp, Shield, Zap,
  ShoppingBag, Leaf, Smile, Coffee, Rocket, 
  LineChart, Clock, Flame, Eye, Calendar, CheckCircle,
  RotateCw, Trophy, Coins
} from "lucide-react";
import Header from "../../components/static/header";
import Footer from "../../components/static/footer";
import { useEffect, useState, useRef } from "react";

// Continuous counter component that keeps growing slowly
function ContinuousCounter({ prefix = "", suffix = "", baseSpeed = 0.5 }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const lastTimestampRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let animationFrame;
    let lastValue = 0;

    const animate = (timestamp) => {
      if (lastTimestampRef.current === 0) {
        lastTimestampRef.current = timestamp;
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = timestamp - lastTimestampRef.current;
      const increment = (baseSpeed * deltaTime) / 1000;
      
      lastValue += increment;
      setCount(lastValue);
      
      lastTimestampRef.current = timestamp;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isVisible, baseSpeed]);

  return (
    <span ref={elementRef}>
      {prefix}{Math.floor(count).toLocaleString()}{suffix}
    </span>
  );
}

export default function AboutUs() {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRedeemClick = () => {
    navigate("/login");
  };

  const handleHowItWorksClick = () => {
    if (location.pathname === "/") {
      const element = document.getElementById("how-it-works");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate("/", { state: { scrollTo: "how-it-works" } });
    }
  };

  const stats = [
    { 
      label: "Active Users", 
      icon: <Users className="w-5 h-5" />, 
      note: "growing every second", 
      prefix: "", 
      suffix: "", 
      animated: true,
      speed: 0.3 
    },
    { 
      label: "Rewards Paid", 
      icon: <Award className="w-5 h-5" />, 
      note: "every rupee matters", 
      prefix: "₹", 
      suffix: "", 
      animated: true,
      speed: 0.8 
    },
    { 
      label: "Partner Brands", 
      icon: <Heart className="w-5 h-5" />, 
      note: "quality over quantity", 
      prefix: "", 
      suffix: "", 
      animated: false,
      staticValue: 2
    },
    { 
      label: "Hours Support", 
      icon: <Clock className="w-5 h-5" />, 
      note: "we are trying our best", 
      prefix: "", 
      suffix: "", 
      animated: false,
      staticValue: 12
    }
  ];

  const values = [
    {
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      title: "Trust & Transparency",
      description: "We don't hide things. If we mess up, we'll tell you."
    },
    {
      icon: <Heart className="w-6 h-6 text-emerald-600" />,
      title: "User First",
      description: "No fancy jargon. No hidden catches. Just rewards."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      title: "Slow & Steady",
      description: "We're not growing overnight. But we're growing right."
    },
    {
      icon: <Flame className="w-6 h-6 text-emerald-600" />,
      title: "Hustle Mode",
      description: "Small team. Big dreams. Limited budget. Unlimited effort."
    }
  ];

  const milestones = [
    { year: "2024", title: "The Beginning", description: "Three friends. A laptop. A crazy idea.", icon: <Coins className="w-6 h-6" /> },
    { year: "2025", title: "We Just Started", description: "Literally. Like... last month. Be nice to us.", icon: <Clock className="w-6 h-6" /> },
    { year: "Tomorrow", title: "Getting There", description: "Slowly. Painfully. But surely.", icon: <RotateCw className="w-6 h-6" /> },
    { year: "Future", title: "Watch This Space", description: "We're just getting warmed up.", icon: <Trophy className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
                <Rocket className="w-4 h-4" />
                We are New Here. Be Patient.
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Small Platform. Big Dreams. Real Rewards.
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                We are not a billion-dollar company (yet). We are just some folks who thought 
                you deserved better rewards. No fancy offices. No corporate BS. Just honest payouts.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-amber-100 px-3 py-1 rounded-full text-sm text-amber-700 mb-3">
                <LineChart className="w-4 h-4" />
                We have Just Started Growing
              </div>
              <p className="text-slate-500 text-sm">
                Numbers are small. But hearts are big. Watch them grow in real time.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-1 text-3xl md:text-4xl font-bold text-green-600 mb-2">
                    {stat.icon}
                    {stat.animated ? (
                      <ContinuousCounter 
                        prefix={stat.prefix} 
                        suffix={stat.suffix}
                        baseSpeed={stat.speed}
                      />
                    ) : (
                      <span>{stat.prefix}{stat.staticValue}{stat.suffix}</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-slate-400 text-xs mt-1 italic">{stat.note}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <p className="text-xs text-slate-400">
                Yes, these numbers are real. And they keep growing. No upper limit.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full text-sm text-green-700 mb-4">
                  <Sparkles className="w-4 h-4" />
                  Honestly, We are Just Getting Started
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  No Venture Capital. No Silver Spoon. Just Hustle.
                </h2>
                <p className="text-slate-600 mb-4">
                  CashCash was not born in a fancy boardroom. It was born on a Google Meet call 
                  at 2 AM when three friends realized why rewards platforms take forever to pay.
                </p>
                <p className="text-slate-600 mb-4">
                  We are not the biggest. We are not the richest. But we promise you this - 
                  when you earn with us, you get paid. No excuses. No technical issues.
                </p>
                <p className="text-slate-600">
                  Today we are small. Tomorrow? Who knows. But we will take you along for the ride. 
                  Every step. Every mistake. Every win.
                </p>
                <div className="mt-6 bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-amber-800 text-sm italic">
                    "We are not a unicorn. We are a caterpillar. But even caterpillars grow wings."
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                  <h3 className="text-xl font-bold text-slate-800">Our Mission (No BS Version)</h3>
                </div>
                <p className="text-slate-600 mb-6">
                  To help you earn real money without jumping through hoops. That is it. Nothing fancy.
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-8 h-8 text-green-600" />
                  <h3 className="text-xl font-bold text-slate-800">Our Vision (If We Make It)</h3>
                </div>
                <p className="text-slate-600">
                  To become the platform where users actually feel valued, not just another number 
                  in a database.
                </p>
                <div className="mt-6 pt-4 border-t border-green-100">
                  <p className="text-xs text-slate-400">
                    We might fail. We might succeed. But we will never stop trying.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">What We Believe In</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Spoiler: It is not complicated. We keep things simple.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 text-center border border-slate-100 hover:shadow-md transition">
                  <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-500">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COLLABORATIONS SECTION */}
{/* COLLABORATIONS SECTION */}
<section className="py-16 bg-slate-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-1.5 rounded-full text-sm text-green-700 mb-4">
        <Gift className="w-4 h-4" />
        Small Collabs. Big Love.
      </div>
      <h2 className="text-3xl font-bold text-slate-800 mb-3">
        Exchange Points for Cool Stuff
      </h2>
      <p className="text-slate-600 max-w-2xl mx-auto">
        We are starting small. Only two partners for now. But hey, quality over quantity, right?
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      
      {/* StreetThread Collaboration */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-slate-100">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-0">
          <img 
            src="/brand-images/rebel.png" 
            alt="StreetThread Logo" 
            className="w-full h-32 object-cover"
          />
        </div>
        <div className="p-6">
          <p className="text-slate-600 mb-4">
            RebelStich makes comfortable t-shirts that don't scream "I bought this online." 
            Support a small brand while flexing your rewards.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Redeem Your Points:</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Limited Stock</span>
            </div>
            <ul className="space-y-1 text-sm text-slate-600">
              <li className="flex items-center gap-2">• Basic Tee - <span className="font-bold text-green-600">10,000 Points</span></li>
              <li className="flex items-center gap-2">• Combo (2 Tees) - <span className="font-bold text-green-600">15,000 Points</span></li>
            </ul>
          </div>
          <button 
            onClick={handleRedeemClick}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition cursor-pointer font-medium"
          >
            Redeem While Stocks Last
          </button>
        </div>
      </div>

      {/* PureGlow Collaboration */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-slate-100">
        <div className="bg-gradient-to-r from-emerald-700 to-green-700 p-0">
          <img 
            src="/brand-images/bhealix.jpeg" 
            alt="PureGlow Logo" 
            className="w-full h-32 object-cover"
          />
        </div>
        <div className="p-6">
          <p className="text-slate-600 mb-4">
            No chemicals. No nonsense. Just skincare that works. Made by a small team 
            who actually cares about your skin.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Redeem Your Points:</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Limited Stock</span>
            </div>
            <ul className="space-y-1 text-sm text-slate-600">
              <li className="flex items-center gap-2">• Vitamin C Serum - <span className="font-bold text-green-600">1,800 Points</span></li>
              <li className="flex items-center gap-2">• Starter Kit (3 products) - <span className="font-bold text-green-600">3,000 Points</span></li>
            </ul>
          </div>
          <button 
            onClick={handleRedeemClick}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition cursor-pointer font-medium"
          >
            Redeem While Stocks Last
          </button>
        </div>
      </div>
    </div>

    <div className="mt-8 text-center">
      <p className="text-xs text-slate-400">
        More brands coming soon. We are talking to people. Promise.
      </p>
    </div>
  </div>
</section>

        {/* Journey Timeline */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-600 mb-3">
                <Clock className="w-4 h-4" />
                Spoiler: We Just Started
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-3">Our Journey (So Far)</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                It is not impressive. Yet. But everyone starts somewhere.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="text-center relative">
                  {index < milestones.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-200 border-dashed border-t-2" />
                  )}
                  <div className="bg-slate-200 text-slate-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 relative z-10">
                    {milestone.icon}
                  </div>
                  <h3 className="font-bold text-slate-800">{milestone.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{milestone.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-xs text-slate-400 italic">
                We don't have a fancy timeline with billions of users. Give us time.
              </p>
            </div>
          </div>
        </section>

        {/* Honest CTA */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Willing to Give Us a Chance?</h2>
            <p className="text-white/90 mb-8">
              We are small. We are new. But we are hungry. Join us and grow along the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login" 
                className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
              >
                Sign Up. It is Free. Seriously.
              </Link>
              <button 
                onClick={handleHowItWorksClick}
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition cursor-pointer"
              >
                See How It Works
              </button>
            </div>
            <p className="text-xs text-white/70 mt-6">
              No catch. No hidden fees. We are too small to afford bad reputation.
            </p>
          </div>
        </section>

        {/* Back to Top */}
        <div className="text-center py-8">
          <button
            onClick={scrollToTop}
            className="px-6 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-sm"
          >
            ↑ Back to top
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}