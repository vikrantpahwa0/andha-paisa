import { useNavigate } from "react-router-dom";
import { FileText, Flame, Gamepad2, TrendingUp, Clock, Shield, Award } from "lucide-react";
import Header from "../../components/static/header";
import Footer from "../../components/static/footer";

export default function HomePage() {
  const navigate = useNavigate();

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

  const stats = [
    { icon: <Users className="w-5 h-5" />, value: "10,000+", label: "Active Users" },
    { icon: <Award className="w-5 h-5" />, value: "₹50L+", label: "Rewards Paid" },
    { icon: <Clock className="w-5 h-5" />, value: "24/7", label: "New Opportunities" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <main>
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

        {/* How It Works */}
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
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

// Helper icon component for Users (still referenced in the removed stats object, but no longer used – you can delete this if you want)
function Users(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}