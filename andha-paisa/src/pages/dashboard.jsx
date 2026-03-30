import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/common/app-layout";

const surveys = [
  { id: 1, title: "Complete Survey & Earn ₹20", reward: "₹20" },
  { id: 2, title: "Quick Survey - ₹15", reward: "₹15" },
];

const games = [
  { id: 3, title: "Spin & Win - ₹50", reward: "₹50" },
  { id: 4, title: "Play Game & Earn ₹30", reward: "₹30" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("games");

  const renderCards = (data) => (
    <div className="grid gap-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl shadow-md p-5 flex justify-between items-center hover:shadow-lg transition"
        >
          <div>
            <h3 className="text-lg font-medium text-slate-800">
              {item.title}
            </h3>
            <p className="text-green-600 font-semibold mt-1">
              Earn {item.reward}
            </p>
          </div>

          <button className="px-5 py-2 rounded-xl bg-green-200 text-slate-900 font-medium hover:bg-green-300 transition active:scale-95">
            Start
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Earn Rewards
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Play games or complete surveys to earn coins
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md p-2 flex w-fit mb-6">
        <button
          onClick={() => setActiveTab("games")}
          className={`px-4 py-2 rounded-xl font-medium ${
            activeTab === "games"
              ? "bg-green-200 text-slate-900"
              : "text-slate-600"
          }`}
        >
          🎮 Games
        </button>

        <button
          onClick={() => setActiveTab("surveys")}
          className={`px-4 py-2 rounded-xl font-medium ${
            activeTab === "surveys"
              ? "bg-green-200 text-slate-900"
              : "text-slate-600"
          }`}
        >
          📝 Surveys
        </button>

        {/* ✅ NEW OFFERS TAB */}
        <button
          onClick={() => navigate("/offerwall")}
          className="px-4 py-2 rounded-xl font-medium text-slate-600 hover:bg-green-100"
        >
          🔥 Offers
        </button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Middle */}
        <div className="lg:col-span-8">
          {activeTab === "games"
            ? renderCards(games)
            : renderCards(surveys)}
        </div>

        {/* Right */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="text-lg font-semibold text-slate-800">
              Your Points
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-3">
              ₹120
            </p>

            <button
              onClick={() => navigate("/profile")}
              className="mt-4 w-full px-4 py-2 rounded-xl bg-green-200 text-slate-900 font-medium hover:bg-green-300"
            >
              View Account
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}