import { useNavigate, useLocation } from "react-router-dom";
import { ClipboardList, CheckCircle, Wallet, Gift, History, Package, PlusCircle, List, Edit } from "lucide-react";
import { useState } from "react";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const menu = [
    { name: "Surveys", path: "/admin/dashboard", icon: ClipboardList },
    { 
      name: "Approvals", 
      path: null, 
      icon: CheckCircle,
      subItems: [
        { name: "Survey Transactions", path: "/admin/approvals", icon: Wallet },
        { name: "Withdrawals", path: "/admin/withdrawals", icon: History },
        // { name: "Gift Transactions", path: "/admin/approvals/gifts", icon: Gift },
        // { name: "Withdraw Requests", path: "/admin/approvals/withdraw-requests", icon: History },
      ]
    },
    { 
      name: "Products", 
      path: "/admin/products", 
      icon: Package,
    },
  ];

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isParentActive = (item) => {
    if (!item.subItems) return false;
    return item.subItems.some(subItem => location.pathname === subItem.path);
  };

  return (
    <div className="h-full bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-tight text-emerald-400">
          Admin Panel ⚙️
        </h1>
      </div>

      {/* Menu */}
      <div className="p-3 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isOpen = openMenu === item.name;
          const isItemActive = hasSubItems ? isParentActive(item) : isActive(item.path);

          return (
            <div key={item.name}>
              {/* Parent Menu Item */}
              <button
                onClick={() => hasSubItems ? toggleMenu(item.name) : navigate(item.path)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition
                  ${
                    isItemActive
                      ? "bg-emerald-500 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="font-medium">{item.name}</span>
                </div>
                {hasSubItems && (
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>

              {/* Sub-items */}
              {hasSubItems && isOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = location.pathname === subItem.path;

                    return (
                      <button
                        key={subItem.name}
                        onClick={() => navigate(subItem.path)}
                        className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition text-sm
                          ${
                            isSubActive
                              ? "bg-emerald-500/80 text-white"
                              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                          }`}
                      >
                        <SubIcon size={16} />
                        <span>{subItem.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}