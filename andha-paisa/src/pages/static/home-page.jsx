import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FileText, Flame, Gamepad2, TrendingUp, Shield, 
  ChevronDown, ChevronUp 
} from "lucide-react";
import Header from "../../components/static/header";
import Footer from "../../components/static/footer";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState(null);

  // Handle scrolling when coming from other pages
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  // Load ad - NO CLEANUP to ensure impression counts
  useEffect(() => {
    // Check if ad already loaded to prevent duplicates
    if (document.getElementById("top-banner-ad-script")) {
      return;
    }

    // Create container for ad scripts
    const adContainer = document.getElementById("top-banner-ad");
    if (!adContainer) return;

    // Clear any existing content to ensure fresh load
    adContainer.innerHTML = '';

    // Add configuration script
    const configScript = document.createElement("script");
    configScript.text = `
      atOptions = {
        'key' : '96753a2eaab5594c1851078716789a9e',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;
    
    // Add invoke script with ID to prevent duplicate
    const invokeScript = document.createElement("script");
    invokeScript.id = "top-banner-ad-script";
    invokeScript.src = "https://www.highperformanceformat.com/96753a2eaab5594c1851078716789a9e/invoke.js";
    invokeScript.async = true;
    
    // Add both scripts to container
    adContainer.appendChild(configScript);
    adContainer.appendChild(invokeScript);
    
    // IMPORTANT: No cleanup function!
    // Removing the ad on unmount would prevent impression counting
    // The browser will handle cleanup naturally
  }, []); // Empty dependency array - runs once on mount

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: <FileText className="w-8 h-8 text-emerald-600" />,
      title: "Paid Surveys",
      description: "Share your opinions and earn points for every survey you complete.",
      reward: "Up to ₹50 per survey",
    },
    {
      icon: <Flame className="w-8 h-8 text-emerald-600" />,
      title: "Hot Offers",
      description: "Try new apps, sign up for services, and earn bonus rewards.",
      reward: "Earn ₹20+ per offer",
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-emerald-600" />,
      title: "Play & Earn",
      description: "Have fun playing games while collecting real rewards.",
      reward: "₹10 - ₹20 per game",
    },
  ];

  const faqs = [
    {
      question: "How do I start earning money?",
      answer: "Simply sign up for a free account, complete your profile, and start taking surveys, trying offers, or playing games. Each activity earns you points that can be redeemed for cash or gifts."
    },
    {
      question: "Is CashCash really free to use?",
      answer: "Yes! CashCash is completely free to join and use. There are no hidden fees or charges. You only earn rewards for completing tasks."
    },
    {
      question: "How do I withdraw my earnings?",
      answer: "You can withdraw your earnings via bank transfer currently."
    },
    {
      question: "How long does it take to receive payments?",
      answer: "Withdrawals are typically processed within 24-48 hours. Bank transfers may take 2-3 business days depending on your bank."
    },
    {
      question: "Are there any limits on how much I can earn?",
      answer: "No, there's no upper limit! The more surveys, offers, and games you complete, the more you earn."
    },
    {
      question: "Is my personal information safe?",
      answer: "Absolutely. We never share your personal data with third parties without your consent. Your privacy is our priority."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <main>
        {/* Top Banner Ad 468x60 - Loads immediately on page visit */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex justify-center">
            <div 
              id="top-banner-ad" 
              style={{ 
                minWidth: '468px', 
                minHeight: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {/* Ad loads immediately when user hits the page */}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Turn Your Free Time Into{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  Real Rewards
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Complete surveys, try exciting offers, play fun games and earn points that you can redeem for cash or gifts.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-slate-900 font-bold text-lg hover:from-green-300 hover:to-green-500 transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                Start Earning Now
                <TrendingUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">
                Multiple Ways to Earn
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Choose from a variety of earning opportunities that fit your lifestyle
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="bg-green-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 mb-3">{feature.description}</p>
                  <p className="text-emerald-600 font-semibold text-sm">
                    {feature.reward}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-gradient-to-b from-slate-50 to-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">
                How It Works
              </h2>
              <p className="text-slate-500">Start earning in three simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Create Account",
                  desc: "Sign up for free and complete your profile",
                },
                {
                  step: "02",
                  title: "Choose Task",
                  desc: "Pick from surveys, offers, or games",
                },
                {
                  step: "03",
                  title: "Earn Rewards",
                  desc: "Collect points and redeem them",
                },
              ].map((item, idx) => (
                <div key={idx} className="text-center relative">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-200 to-green-400 bg-clip-text text-transparent mb-3">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500">{item.desc}</p>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-8 -right-4 text-green-300 text-2xl">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-white scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-500">
                Got questions? We've got answers
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-green-200 transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-green-50/30 transition"
                  >
                    <span className="font-semibold text-slate-800 text-lg">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" />
                    )}
                  </button>
                  
                  {openFaq === index && (
                    <div className="px-6 pb-4 pt-0">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-green-100">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-slate-600 mb-6 max-w-lg mx-auto">
                Join users who are already earning rewards every day
              </p>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-slate-900 font-semibold hover:from-green-300 hover:to-green-500 transition active:scale-95 shadow-md inline-flex items-center gap-2"
              >
                Get Started Now
                <Shield className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}