import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserSurveys } from "../store/slices/user-survey-slice";
import AppLayout from "../components/common/app-layout";

const games = [
  { id: 3, title: "Spin & Win - ₹50", reward: "₹50" },
  { id: 4, title: "Play Game & Earn ₹30", reward: "₹30" },
];

const offers = [
  {
    id: 5,
    title: "Explore Offers",
    reward: "₹80",
    link: "/offerwall",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { surveys, isLoading } = useSelector((state) => state.userSurvey);
  const [activeTab, setActiveTab] = useState("surveys");

  useEffect(() => {
    dispatch(getUserSurveys());
  }, [dispatch]);

  const handleStart = (item) => {
    if (item.link) {
      navigate(item.link);
    }
  };

  const handleStartSurvey = (survey) => {
    if (survey.status === "STR") {
      navigate(`/survey/${survey.id}`);
    }
  };

  const renderCards = (data) => (
    <div className="grid gap-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex justify-between items-center hover:shadow-md hover:-translate-y-1 transition-all duration-200"
        >
          <div>
            <h3 className="text-lg font-medium text-slate-800">{item.title}</h3>
            {item.reward && <p className="text-emerald-600 font-semibold mt-1">{item.reward}</p>}
          </div>

          <button
            onClick={() => handleStart(item)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-slate-900 font-semibold hover:from-green-300 hover:to-green-500 transition active:scale-95 shadow-sm"
          >
            Start
          </button>
        </div>
      ))}
    </div>
  );

  const renderSurveyCards = () => {
    if (isLoading) return <p className="text-center py-8">Loading surveys...</p>;
    
    return (
      <div className="grid gap-4">
        {surveys.map((survey) => {
          const isDisabled = survey.status !== "STR";
          
          return (
            <div
              key={survey.id}
              className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex justify-between items-center ${
                isDisabled ? "opacity-75" : "hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              }`}
            >
              <div>
                <h3 className="text-lg font-medium text-slate-800">{survey.name}</h3>
                <p className="text-emerald-600 font-semibold mt-1">
                  +{survey.rewardPoints || parseInt(survey.reward) * 10} Coins
                </p>
                <p className="text-xs text-gray-500 mt-1">Questions: {survey.questions?.length || 0}</p>
                {survey.status === "LCK" && <p className="text-xs text-yellow-600 mt-1">Locked - Complete previous survey first</p>}
                {survey.status === "ALS" && <p className="text-xs text-green-600 mt-1">Completed</p>}
                {survey.status === "STR" && <p className="text-xs text-blue-600 mt-1">Ready to start</p>}
              </div>

              <button
                onClick={() => handleStartSurvey(survey)}
                disabled={isDisabled}
                className={`px-5 py-2 rounded-xl font-semibold transition active:scale-95 shadow-sm ${
                  isDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-slate-900 hover:from-green-300 hover:to-green-500"
                }`}
              >
                {survey.status === "ALS" ? "Completed" : survey.status === "LCK" ? "Locked" : "Start"}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const getActiveData = () => {
    if (activeTab === "offers") return offers;
    if (activeTab === "games") return games;
    return [];
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Earn Rewards</h1>
        <p className="text-gray-500 text-sm mt-1">
          Complete surveys, try offers or play games to earn coins
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md p-2 flex w-fit mb-6">
        <button
          onClick={() => setActiveTab("surveys")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            activeTab === "surveys"
              ? "bg-green-200 text-slate-900"
              : "text-slate-600 hover:bg-green-100"
          }`}
        >
          📝 Surveys
        </button>

        <button
          onClick={() => setActiveTab("offers")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            activeTab === "offers"
              ? "bg-green-200 text-slate-900"
              : "text-slate-600 hover:bg-green-100"
          }`}
        >
          🔥 Offers
        </button>

        <button
          onClick={() => setActiveTab("games")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            activeTab === "games"
              ? "bg-green-200 text-slate-900"
              : "text-slate-600 hover:bg-green-100"
          }`}
        >
          🎮 Games
        </button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RIGHT SECTION */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-green-200 via-green-300 to-green-400 rounded-2xl shadow-md p-6">
            <h3 className="text-sm text-slate-700">Your Balance</h3>

            <p className="text-4xl font-bold mt-2 text-slate-900">₹120</p>

            <p className="text-xs mt-1 text-slate-600">
              Keep earning to withdraw 💰
            </p>

            <button
              onClick={() => navigate("/profile")}
              className="mt-6 w-full bg-white text-green-600 font-semibold py-2 rounded-xl hover:bg-green-100 transition"
            >
              Withdraw / Account
            </button>
          </div>

          {/* Today’s Goal */}
          <div className="bg-gradient-to-br from-green-200 via-green-300 to-green-400 rounded-2xl shadow-md p-5 mt-4">
            <h4 className="text-sm text-slate-700">Today’s Goal</h4>
            <p className="text-lg font-semibold mt-1 text-slate-900">
              Earn ₹50
            </p>

            <div className="w-full bg-white/50 h-2 rounded-full mt-3">
              <div className="bg-green-600 h-2 rounded-full w-[40%]" />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          {activeTab === "surveys" ? renderSurveyCards() : renderCards(getActiveData())}
        </div>
      </div>
    </AppLayout>
  );
}