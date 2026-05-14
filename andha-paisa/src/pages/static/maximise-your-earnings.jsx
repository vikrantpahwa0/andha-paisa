import { Link } from "react-router-dom";
import { 
  Trophy, FileText, Video, Gift, RotateCw, Gamepad2,
  TrendingUp, DollarSign, Zap, Clock, CheckCircle, Star,
  ArrowRight, Sparkles, Flame, Award, Coins
} from "lucide-react";
import Header from "../../components/static/header";
import Footer from "../../components/static/footer";

export default function MaximiseEarnings() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const earningMethods = [
    {
      id: "surveys",
      icon: <FileText className="w-8 h-8" />,
      title: "Paid Surveys",
      description: "Share your opinion and earn rewards. Complete surveys directly from your dashboard.",
      points: "upto 50 points per survey",
      time: "5-20 minutes",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      features: [
        "Directly available on dashboard",
        "No minimum qualification required",
        "Points Credited Post review"
      ]
    },
    {
      id: "video-surveys",
      icon: <Video className="w-8 h-8" />,
      title: "Video Surveys",
      description: "Watch short videos, answer simple factual questions, and earn points instantly.",
      points: "upto 100 points per video",
      time: "2-5 minutes",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      features: [
        "Watch engaging video content",
        "Simple factual questions",
        "Quick and easy earnings"
      ]
    },
    {
      id: "offers",
      icon: <Gift className="w-8 h-8" />,
      title: "Rewarding Offers",
      description: "Watch videos, visit websites, try products, and claim your rewards.",
      points: "Upto 50 points per offer",
      time: "1-10 minutes",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      features: [
        "Watch videos for points",
        "Visit partner websites",
        "Try new products and services"
      ]
    },
    {
      id: "games",
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "Play & Earn Games",
      description: "Play Spin & Win daily, plus other rewarding games to boost your earnings.",
      points: "Upto 100 Points",
      time: "1-10 minutes",
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      features: [
        "Daily Spin & Win",
        "Rewarding mini games",
        "Bonus multipliers available"
      ]
    }
  ];

  const tips = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Complete Daily",
      description: "Log in every day to complete available surveys and offers."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Spin Daily",
      description: "Don't miss your daily Spin & Win for guaranteed points."
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Refer Friends",
      description: "Invite friends and earn bonus points when they join."
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Stay Consistent",
      description: "Regular activity adds up quickly. Small efforts = big rewards."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
                <TrendingUp className="w-4 h-4" />
                Boost Your Income
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Maximise Your Earnings
              </h1>
              <p className="text-lg text-white/90">
                Multiple ways to earn. Complete surveys, watch videos, play games, and cash out real money.
              </p>
            </div>
          </div>
        </section>

        {/* Earning Methods */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">
                Ways to Earn
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Choose from multiple earning methods and start building your rewards today
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {earningMethods.map((method, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition"
                >
                  <div className={`bg-gradient-to-r ${method.color} p-4 text-white`}>
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-xl p-2">
                        {method.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{method.title}</h3>
                        <p className="text-white/80 text-sm">{method.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-600 text-sm mb-3">{method.description}</p>
                    <div className={`inline-flex items-center gap-1 ${method.textColor} text-sm font-medium mb-4`}>
                      <Coins className="w-4 h-4" />
                      <span>{method.points}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {method.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-500">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/login"
                      className={`inline-flex items-center gap-2 ${method.textColor} font-medium text-sm hover:gap-3 transition`}
                    >
                      Start Earning
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Tips */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full text-sm text-green-700 mb-3">
                <Sparkles className="w-4 h-4" />
                Pro Tips
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Maximise Your Daily Earnings
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {tips.map((tip, index) => (
                <div key={index} className="bg-white rounded-xl p-5 text-center border border-slate-100 hover:shadow-md transition">
                  <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <div className="text-green-600">
                      {tip.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{tip.title}</h3>
                  <p className="text-sm text-slate-500">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-4">
              <Award className="w-4 h-4" />
              Start Earning Today
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already earning real cash rewards with CashCash
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login" 
                className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
              >
                Sign Up for Free
              </Link>
              <Link 
                to="/how-it-works" 
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
              >
                Learn More
              </Link>
            </div>
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