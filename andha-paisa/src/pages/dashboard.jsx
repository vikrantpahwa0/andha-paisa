import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Flame, Gamepad2, ExternalLink } from "lucide-react";
import {
  getUserSurveys,
  getThirdPartyCampaigns,
} from "../store/slices/user-survey-slice";
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
  const { surveys, allSurveys, isLoading } = useSelector(
    (state) => state.userSurvey,
  );
  const [activeTab, setActiveTab] = useState("surveys");
  const [triggerPopunder, setTriggerPopunder] = useState(false);

  useEffect(() => {
    dispatch(getUserSurveys());
    dispatch(getThirdPartyCampaigns());
  }, [dispatch]);

  const handleStart = (item) => {
    if (!item.link) return;

    if (item.isExternal || item.link.startsWith("http")) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    } else {
      navigate(item.link);
    }
  };

  const handleStartSurvey = (survey) => {
    if (!survey.is_third_party && survey.status === "STR") {
      setTriggerPopunder(true);
      setTimeout(() => {
        navigate(`/survey/${survey.id}`);
      }, 100);
    }
  };

  const handleThirdPartyClick = (campaign) => {
    const url = campaign.preview_url || campaign.tracking_url;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const renderSurveyCards = () => {
    if (isLoading)
      return <p className="text-center py-8">Loading surveys...</p>;

    if (allSurveys.length === 0) {
      return (
        <p className="text-center py-8 text-slate-500">
          No surveys available at the moment.
        </p>
      );
    }

    return (
      <div className="grid gap-4">
        {allSurveys.map((survey) => {
          const isThirdParty = survey.is_third_party;
          const isDisabled = !isThirdParty && survey.status !== "STR";
          const hasUrl =
            isThirdParty && (survey.preview_url || survey.tracking_url);

          return (
            <div key={survey.id}>
              <div
                className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex justify-between items-center ${
                  isDisabled || (isThirdParty && !hasUrl)
                    ? "opacity-75"
                    : "hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-slate-800">
                      {survey.name}
                    </h3>
                    {isThirdParty && (
                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Offer
                      </span>
                    )}
                  </div>

                  <p className="text-emerald-600 font-semibold mt-1">
                    {isThirdParty
                      ? `+${survey.payout || "N/A"} ${survey.currency || "Points"}`
                      : `+${survey.rewardPoints || "N/A"} Points`}
                  </p>

                  {isThirdParty && survey.short_description && (
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {survey.short_description.replace(/<[^>]*>/g, "")}
                    </p>
                  )}

                  {!isThirdParty && survey.status === "LCK" && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Locked - Complete previous survey first
                    </p>
                  )}
                  {!isThirdParty && survey.status === "ALS" && (
                    <p className="text-xs text-green-600 mt-1">Completed</p>
                  )}
                  {!isThirdParty && survey.status === "STR" && (
                    <p className="text-xs text-blue-600 mt-1">Ready to start</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (isThirdParty) {
                      handleThirdPartyClick(survey);
                    } else {
                      handleStartSurvey(survey);
                    }
                  }}
                  disabled={isDisabled || (isThirdParty && !hasUrl)}
                  className={`px-5 py-2 rounded-xl font-semibold transition active:scale-95 shadow-sm ${
                    isDisabled || (isThirdParty && !hasUrl)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : isThirdParty
                        ? "bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 text-slate-900 hover:from-purple-300 hover:to-purple-500"
                        : "bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-slate-900 hover:from-green-300 hover:to-green-500"
                  }`}
                >
                  {isThirdParty
                    ? "Start Offer"
                    : survey.status === "ALS"
                      ? "Completed"
                      : survey.status === "LCK"
                        ? "Locked"
                        : "Start"}
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex justify-between items-center hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div>
              <h3 className="text-lg font-medium text-slate-800">
                {item.title}
              </h3>
              {item.reward && (
                <p className="text-emerald-600 font-semibold mt-1">
                  {item.reward}
                </p>
              )}
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
      {triggerPopunder && (
        <SurveyPopunder onTriggered={() => setTriggerPopunder(false)} />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Earn Rewards</h1>
        <p className="text-gray-500 text-sm mt-1">
          Complete surveys, try offers or play games to earn coins
        </p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 order-1 lg:order-2">
          <EarningsSidebar />
        </div>

        <div className="lg:col-span-8 order-2 lg:order-1">
          {activeTab === "surveys" && renderSurveyCards()}
          {activeTab === "offers" && renderCards(offers)}
          {activeTab === "games" && <GamesSection />}

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
