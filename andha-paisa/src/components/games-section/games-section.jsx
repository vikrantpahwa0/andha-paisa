// src/components/dashboard/GamesSection.jsx
import { useState } from "react";
import { Gamepad2, Trophy, Sparkles } from "lucide-react";
import CSSCustomWheel from "../mini-games/spin-wheel";
import Toast from "../common/toast"; // 👈 import toast

const games = [
  { id: 3, title: "Spin & Win", reward: "₹50", icon: Gamepad2 },
  { id: 4, title: "Play Game & Earn ₹30", reward: "₹30", icon: Trophy },
];

const wheelPrizes = [
  { name: "10 points", probability: 0.1, value: 10, color: "#86efac" },
  { name: "20 points", probability: 0.1, value: 20, color: "#4ade80" },
  { name: "50 points", probability: 0.1, value: 50, color: "#22c55e" },
  { name: "100 points", probability: 0.1, value: 100, color: "#10b981" },
  { name: "Bonus spin", probability: 0.1, value: 0, isBonus: true, color: "#fbbf24" },
  { name: "Try again", probability: 0.5, value: 0, color: "#94a3b8" },
];

const GamesSection = () => {
  const [showWheelModal, setShowWheelModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [toast, setToast] = useState(null); // 👈 toast state

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStart = (game) => {
    setSelectedGame(game);
    setShowWheelModal(true);
  };

  const handleSpinEnd = (prize) => {
    if (prize.value > 0) {
      showToast(`You won ${prize.value} points!`, "success");
      // TODO: dispatch action to add points
    } else if (prize.name === "Bonus spin") {
      showToast("Bonus spin! Click SPIN again.", "bonus");
    } else {
      showToast("No points this time. Better luck next spin!", "error");
    }
  };

  return (
    <>
      <div className="grid gap-4">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex justify-between items-center hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-emerald-600">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-800">{game.title}</h3>
                  <p className="text-emerald-600 font-semibold mt-1">{game.reward}</p>
                </div>
              </div>
              <button
                onClick={() => handleStart(game)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-slate-900 font-semibold hover:from-green-300 hover:to-green-500 transition active:scale-95 shadow-sm"
              >
                Start
              </button>
            </div>
          );
        })}
      </div>

      {/* Spin Wheel Modal */}
      {showWheelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowWheelModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-center text-slate-800 mb-4">{selectedGame?.title}</h2>
            <CSSCustomWheel
              key={selectedGame?.id}
              prizes={wheelPrizes}
              onSpinEnd={handleSpinEnd}
              size={300}
            />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default GamesSection;