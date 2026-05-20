import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Gamepad2, ClipboardList, Gift, User, Coins } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Earn", path: "/dashboard", icon: Home },
    { name: "Activity", path: "/activity", icon: ClipboardList },
    { name: "Account", path: "/profile", icon: User },
  ];

  // Load 300x250 banner ad
  useEffect(() => {
    const adContainer = document.getElementById("sidebar-banner-300x250");
    if (!adContainer) return;

    // Clear any existing content
    adContainer.innerHTML = '';

    // Create config script - TRY SMALLER SIZE
    const configScript = document.createElement("script");
    configScript.text = `
      atOptions = {
        'key' : '502893a28b3badbe90ace6ff83709314',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
    
    // Create invoke script
    const invokeScript = document.createElement("script");
    invokeScript.src = "https://www.highperformanceformat.com/502893a28b3badbe90ace6ff83709314/invoke.js";
    
    adContainer.appendChild(configScript);
    adContainer.appendChild(invokeScript);

    // No cleanup to keep impression counted
  }, []);

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

      {/* 300x250 Banner Ad - Scaled down */}
      <div className="mt-auto p-4 border-t border-slate-100">
        <div className="flex justify-center overflow-hidden">
          <div 
            id="sidebar-banner-300x250" 
            style={{ 
              width: '250px', 
              minHeight: '208px',  // Proportionally scaled (250/300 * 250 = 208)
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: 'scale(0.83)',  // Scale down to 83% of original
              transformOrigin: 'center center'
            }}
          />
        </div>
      </div>
    </div>
  );
}