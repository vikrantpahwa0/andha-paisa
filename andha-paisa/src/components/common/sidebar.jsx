// Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ClipboardList, User } from "lucide-react";
import SidebarDesktopAd from "../ad-components/300x250";
import SidebarMobileAd from "../ad-components/320x50";

export default function Sidebar({ isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Earn", path: "/dashboard", icon: Home },
    { name: "Activity", path: "/activity", icon: ClipboardList },
    { name: "Account", path: "/profile", icon: User },
  ];

  return (
    <div className="h-full bg-white shadow-md flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b flex items-center gap-1.5">
        <img
          src="/icons/icon.png"
          alt="Cash Cash Logo"
          className="w-20 h-20 object-contain scale-110 -ml-1"
        />

        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
          CashCash
        </h1>
      </div>

      {/* Menu */}
      <div className="p-3 space-y-1">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-green-100 text-green-700 border-l-4 border-green-500"
                    : "text-slate-600 hover:bg-green-50 hover:text-green-600"
                }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Ad Section */}
      <div className="mt-auto p-4 border-t border-slate-100">
        <div className="flex justify-center overflow-hidden">
          {isMobile ? <SidebarMobileAd /> : <SidebarDesktopAd />}
        </div>
      </div>
    </div>
  );
}