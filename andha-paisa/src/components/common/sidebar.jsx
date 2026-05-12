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

  return (
    <div className="h-full bg-white shadow-md flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b flex items-center gap-2">
  <img 
  src="/icons/web-app-manifest-192x192.png" 
  alt="cash Cash Logo" 
  className="w-12 h-12 object-contain"
/>
  <h1 className="text-xl font-bold text-green-600 tracking-tight">
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
    </div>
  );
}