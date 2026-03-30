import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Earn", path: "/" },
    { name: "Surveys", path: "/surveys" },
    { name: "Offers", path: "/offers" },
    { name: "Games", path: "/games" },
    { name: "Account", path: "/profile" },
  ];

  return (
    <div className="h-full bg-white shadow-md flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-semibold text-green-600">
          Andha Paisa 💰
        </h1>
      </div>

      {/* Menu */}
      <div className="p-4 space-y-2">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-2 rounded-xl transition
                ${
                  isActive
                    ? "bg-green-200 text-slate-900"
                    : "text-slate-700 hover:bg-green-100 hover:text-green-700"
                }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}