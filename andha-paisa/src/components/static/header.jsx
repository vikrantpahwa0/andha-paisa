import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Coins, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const scrollToSection = (sectionId) => {
    closeMenu();
    
    if (location.pathname === "/") {
      // Already on homepage - just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Navigate to homepage first, then scroll after page loads
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  const navLinks = [
    { name: "How it works", action: () => scrollToSection("how-it-works") },
    { name: "FAQ", action: () => scrollToSection("faq") },
    { name: "Maximise your earnings", path: "#" },
    { name: "Blogs", path: "#" },
    { name: "Campaigns", path: "#" },
  ];

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            <div className="bg-gradient-to-br from-green-300 to-green-500 p-1.5 rounded-xl shadow-sm">
              <Coins className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              CashCash
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={navLinks[0].action}
              className="text-slate-600 hover:text-green-600 font-medium transition cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={navLinks[1].action}
              className="text-slate-600 hover:text-green-600 font-medium transition cursor-pointer"
            >
              FAQ
            </button>
            <Link
              to={navLinks[2].path}
              className="text-slate-600 hover:text-green-600 font-medium transition"
            >
              Maximise your earnings
            </Link>
            <Link
              to={navLinks[3].path}
              className="text-slate-600 hover:text-green-600 font-medium transition"
            >
              Blogs
            </Link>
            <Link
              to={navLinks[4].path}
              className="text-slate-600 hover:text-green-600 font-medium transition"
            >
              Campaigns
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div className="flex justify-end p-4">
            <button onClick={closeMenu} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-4 px-6">
            <button
              onClick={navLinks[0].action}
              className="text-left text-slate-700 hover:text-green-600 font-medium text-lg py-2 border-b border-slate-100"
            >
              How it works
            </button>
            <button
              onClick={navLinks[1].action}
              className="text-left text-slate-700 hover:text-green-600 font-medium text-lg py-2 border-b border-slate-100"
            >
              FAQ
            </button>
            <Link
              to={navLinks[2].path}
              onClick={closeMenu}
              className="text-slate-700 hover:text-green-600 font-medium text-lg py-2 border-b border-slate-100"
            >
              Maximise your earnings
            </Link>
            <Link
              to={navLinks[3].path}
              onClick={closeMenu}
              className="text-slate-700 hover:text-green-600 font-medium text-lg py-2 border-b border-slate-100"
            >
              Blogs
            </Link>
            <Link
              to={navLinks[4].path}
              onClick={closeMenu}
              className="text-slate-700 hover:text-green-600 font-medium text-lg py-2 border-b border-slate-100"
            >
              Campaigns
            </Link>
          </nav>
        </div>

        {/* Overlay when menu is open */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={closeMenu}
          />
        )}
      </div>
    </header>
  );
}