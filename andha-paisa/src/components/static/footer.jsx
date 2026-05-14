import { Link } from "react-router-dom";
import { Coins, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column - CashCash */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-1.5 mb-4">
  <img 
    src="/icons/web-app-manifest-192x192.png" 
    alt="CashCash Logo" 
    className="w-16 h-16 object-contain scale-110 -ml-1"
  />

  <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
    CashCash
  </span>
</div>
            <p className="text-slate-500 text-sm mb-4 max-w-md">
              Earn real cash rewards by completing surveys, trying offers, and playing games.
              Turn your free time into valuable payouts with CashCash.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-slate-400 hover:text-slate-600 transition">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-600 transition">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-slate-500 hover:text-green-600 text-sm transition">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="#" className="text-slate-500 hover:text-green-600 text-sm transition">
                  Campaigns
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms-and-conditions" className="text-slate-500 hover:text-green-600 text-sm transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-500 hover:text-green-600 text-sm transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-slate-500 hover:text-green-600 text-sm transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-slate-500 hover:text-green-600 text-sm transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} CashCash. All rights reserved.
        </div>
      </div>
    </footer>
  );
}