import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Coins,
  Menu,
  X,
  Briefcase,
  ChevronDown,
  FileText,
  Send,
} from "lucide-react";
import HeaderBanner from "../ad-components/468x60-home";

const APPLY_LINKS = [
  { to: "/create-template", label: "Create Template", icon: FileText },
  { to: "/apply-jobs", label: "Apply", icon: Send },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false); // desktop dropdown
  const [isMobileApplyOpen, setIsMobileApplyOpen] = useState(false); // mobile accordion
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMobileApplyOpen(false);
  };

  const scrollToSection = (sectionId) => {
    closeMenu();

    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  const navLinks = [
    { name: "How it works", action: () => scrollToSection("how-it-works") },
    { name: "FAQ", action: () => scrollToSection("faq") },
    { name: "Maximise your earnings", path: "/maximise-your-earnings" },
    { name: "About", path: "/about-us" },
  ];

  const isApplyActive = APPLY_LINKS.some((l) =>
    location.pathname.startsWith(l.to),
  );

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsApplyOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setIsApplyOpen(false);
    closeMenu();
  }, [location.pathname]);

  return (
    <>
      {/* Top Banner Ad - Below header */}
      <HeaderBanner />

      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <Link
              to="/"
              className="flex items-center gap-1 group flex-shrink-0"
              onClick={closeMenu}
            >
              <img
                src="/icons/web-app-manifest-192x192.png"
                alt="CashCash"
                className="w-16 h-16 md:w-20 md:h-20 object-contain scale-110 -ml-1 transition-transform duration-200 group-hover:scale-[1.15]"
              />
              <span className="text-xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent whitespace-nowrap">
                CashCash
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to={navLinks[3].path}
                className="text-slate-600 hover:text-green-600 font-medium transition"
              >
                About
              </Link>
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

              {/* ===== Apply Jobs dropdown ===== */}
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={() => setIsApplyOpen(true)}
                onMouseLeave={() => setIsApplyOpen(false)}
              >
                <button
                  onClick={() => setIsApplyOpen((v) => !v)}
                  className={`flex items-center gap-1 font-medium transition ${
                    isApplyActive
                      ? "text-green-600"
                      : "text-slate-600 hover:text-green-600"
                  }`}
                >
                  Apply Jobs
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isApplyOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isApplyOpen && (
                  /* Outer wrapper sits flush under the button.
                     pt-2 bridges the gap so hover is continuous and the
                     menu never closes before your click registers. */
                  <div className="absolute right-0 top-full pt-2 w-56 z-50">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-2">
                      {APPLY_LINKS.map(({ to, label, icon: Icon }) => {
                        const active = location.pathname === to;
                        return (
                          <Link
                            key={to}
                            to={to}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
                              active
                                ? "bg-green-100 text-emerald-700"
                                : "text-slate-700 hover:bg-green-50 hover:text-emerald-700"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            } md:hidden`}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-4 px-6">
              <Link
                to={navLinks[3].path}
                onClick={closeMenu}
                className="text-slate-700 hover:text-green-600 font-medium text-lg py-2 border-b border-slate-100"
              >
                About
              </Link>
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

              {/* ===== Apply Jobs (mobile accordion) ===== */}
              <div className="border-b border-slate-100">
                <button
                  onClick={() => setIsMobileApplyOpen((v) => !v)}
                  className="w-full flex items-center justify-between text-left text-slate-700 hover:text-green-600 font-medium text-lg py-2"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Apply Jobs
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isMobileApplyOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMobileApplyOpen && (
                  <div className="flex flex-col gap-2 pb-2 pl-6">
                    {APPLY_LINKS.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={closeMenu}
                        className="flex items-center gap-2 text-slate-600 hover:text-green-600 font-medium py-1.5"
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
    </>
  );
}
