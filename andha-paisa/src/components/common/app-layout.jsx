import { useState } from "react";
import Sidebar from "./sidebar";
import PWAPrompt from "./PWAPrompt";
import UserMenu from "./user-menu";   // <-- import

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-white">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6">
        {/* Mobile Topbar */}
        <div className="md:hidden mb-4 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-3 py-2 bg-white rounded-lg shadow"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold text-green-600">
            Andha Paisa 💰
          </h1>
          {/* UserMenu on mobile (right side) */}
          <UserMenu />
        </div>

        {/* Desktop Topbar - User Menu */}
        <div className="hidden md:flex justify-end mb-6">
          <UserMenu />
        </div>

        {children}
      </div>

      {/* PWA Install Prompt */}
      <PWAPrompt />
    </div>
  );
}