import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ClipboardList, User } from "lucide-react";

export default function Sidebar({ isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Earn", path: "/dashboard", icon: Home },
    { name: "Activity", path: "/activity", icon: ClipboardList },
    { name: "Account", path: "/profile", icon: User },
  ];

  useEffect(() => {
  const timer = setTimeout(() => {
    const adContainer = document.getElementById(
      isMobile ? "sidebar-mobile-ad" : "sidebar-desktop-ad"
    );

    if (!adContainer) return;

    adContainer.innerHTML = "";

    const configScript = document.createElement("script");

    if (isMobile) {
      configScript.innerHTML = `
        atOptions = {
          'key' : '666294eb6c5aa819b9902f1956c425cc',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
    } else {
      configScript.innerHTML = `
        atOptions = {
          'key' : '502893a28b3badbe90ace6ff83709314',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;
    }

    const invokeScript = document.createElement("script");

    invokeScript.src = isMobile
      ? "https://www.highperformanceformat.com/666294eb6c5aa819b9902f1956c425cc/invoke.js"
      : "https://www.highperformanceformat.com/502893a28b3badbe90ace6ff83709314/invoke.js";

    invokeScript.async = true;

    adContainer.appendChild(configScript);
    adContainer.appendChild(invokeScript);
  }, 300);

  return () => clearTimeout(timer);
}, [isMobile]);

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
          {isMobile ? (
            <div
              id="sidebar-mobile-ad"
              style={{
                width: "320px",
                minHeight: "50px",
              }}
            />
          ) : (
            <div
              id="sidebar-desktop-ad"
              style={{
                width: "300px",
                minHeight: "250px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}