import { Link } from "react-router-dom";
import { Mail, Copy, CheckCircle } from "lucide-react";
import Header from "../../components/static/header";
import Footer from "../../components/static/footer";
import { useState } from "react";

export default function ContactUs() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("cashcashsupport@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
                <Mail className="w-4 h-4" />
                Get in Touch
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-white/90">
                Have questions or feedback? Send us an email and we'll get back to you within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Email Section */}
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
              <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Send us an Email
              </h2>
              <p className="text-slate-500 mb-6">
                For support, queries, or feedback — we're just an email away.
              </p>

              <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-medium text-slate-800">cashcashsupport@gmail.com</span>
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <a
                href="mailto:cashcashsupport@gmail.com"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition"
              >
                <Mail className="w-4 h-4" />
                Open Email Client
              </a>

              <p className="text-xs text-slate-400 mt-6">
                We typically respond within 24 hours on business days.
              </p>
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