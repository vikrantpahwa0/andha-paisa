import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Flame, Gamepad2 } from "lucide-react";
import { getUserSurveys } from "../store/slices/user-survey-slice";
import AppLayout from "../components/common/app-layout";
import EarningsSidebar from "../components/dashboard/earnings-display";
import GamesSection from "../components/games-section/games-section";
import NativeBanner from "../components/ad-components/native-banner";
import SurveyPopunder from "../components/ad-components/survey-popunder";

const offers = [
  {
    id: 5,
    title: "Explore Offers",
    reward: "Explore various offers to earn points",
    link: "/offerwall",
    isExternal: false,
  },
  {
    id: 6,
    title: "Visit the Following site",
    reward: "10 Points",
    link: "https://www.effectivecpmnetwork.com/ugck7xs7?key=085476cd98c57bb7c5945ecc54421d3a",
    isExternal: true,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { surveys, isLoading } = useSelector((state) => state.userSurvey);
  const [activeTab, setActiveTab] = useState("surveys");
  const [triggerPopunder, setTriggerPopunder] = useState(false);

  useEffect(() => {
    dispatch(getUserSurveys());
  }, [dispatch]);

  const handleStart = (item) => {
    if (!item.link) return;
    
    if (item.isExternal || item.link.startsWith('http')) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(item.link);
    }
  };

  const handleStartSurvey = (survey) => {
    if (survey.status === "STR") {
      setTriggerPopunder(true);
      setTimeout(() => {
        navigate(`/survey/${survey.id}`);
      }, 100);
    }
  };

  const renderSurveyCards = () => {
    if (isLoading) return <p className="text-center py-8">Loading surveys...</p>;
    
    if (surveys.length === 0) {
      return <p className="text-center py-8 text-slate-500">No surveys available at the moment.</p>;
    }
    
    return (
      <div className="grid gap-4">
        {surveys.map((survey) => {
          const isDisabled = survey.status !== "STR";
          
          return (
            <div key={survey.id}>
              {/* Survey Card */}
              <div
                className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex justify-between items-center ${
                  isDisabled ? "opacity-75" : "hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                }`}
              >
                <div>
                  <h3 className="text-lg font-medium text-slate-800">{survey.name}</h3>
                  <p className="text-emerald-600 font-semibold mt-1">
                    +{survey.rewardPoints} Points 
                  </p>
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
            </div>
          );
        })}
      </div>
    );
  };

  const renderCards = (data) => (
    <div className="grid gap-4">
      {data.map((item) => (
        <div key={item.id}>
          <div
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
        </div>
      ))}
    </div>
  );

  return (
    <AppLayout>
      {/* Popunder Ad - Triggers when survey starts */}
      {triggerPopunder && <SurveyPopunder onTriggered={() => setTriggerPopunder(false)} />}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Earn Rewards</h1>
        <p className="text-gray-500 text-sm mt-1">
          Complete surveys, try offers or play games to earn coins
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md p-2 flex w-fit gap-1 mb-6">
        <button
          onClick={() => setActiveTab("surveys")}
          className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
            activeTab === "surveys"
              ? "bg-green-200 text-slate-900"
              : "text-slate-600 hover:bg-green-100"
          }`}
        >
          <FileText className="w-4 h-4" />
          Surveys
        </button>

        <button
          onClick={() => setActiveTab("offers")}
          className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
            activeTab === "offers"
              ? "bg-green-200 text-slate-900"
              : "text-slate-600 hover:bg-green-100"
          }`}
        >
          <Flame className="w-4 h-4" />
          Offers
        </button>

        <button
          onClick={() => setActiveTab("games")}
          className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
            activeTab === "games"
              ? "bg-green-200 text-slate-900"
              : "text-slate-600 hover:bg-green-100"
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          Games
        </button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RIGHT SECTION */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          <EarningsSidebar/>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          {/* Tab Content */}
          {activeTab === "surveys" && renderSurveyCards()}
          {activeTab === "offers" && renderCards(offers)}
          {activeTab === "games" && <GamesSection />}
          
          {/* Native Banner - EK BAAR LOAD, SAB TABS KE NEE CHE */}
          <div className="mt-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <NativeBanner />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}