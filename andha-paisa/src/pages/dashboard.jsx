import { useNavigate } from "react-router-dom";

const surveys = [
  {
    id: 1,
    title: "Complete Survey & Earn ₹20",
    reward: "₹20",
    link: "https://mylead.global/offer1",
  },
  {
    id: 2,
    title: "Quick Survey - ₹15",
    reward: "₹15",
    link: "https://mylead.global/offer2",
  },
];

const games = [
  {
    id: 3,
    title: "Spin & Win - ₹50",
    reward: "₹50",
    link: "https://mylead.global/offer3",
  },
  {
    id: 4,
    title: "Play Game & Earn ₹30",
    reward: "₹30",
    link: "https://mylead.global/offer4",
  },
];

function Dashboard() {
  const navigate = useNavigate();

  const handleOfferClick = (offerLink) => {
    const userId = "user_1"; // TODO: replace with real logged-in user id
    const finalLink = `${offerLink}?ml_sub1=${userId}`;
    window.open(finalLink, "_blank");
  };

  const renderSection = (title, data) => (
    <div className="max-w-4xl mx-auto mb-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">{title}</h2>

      <div className="grid gap-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between hover:shadow-lg transition"
          >
            <div>
              <h3 className="text-lg font-medium text-slate-800">
                {item.title}
              </h3>
              <p className="text-green-600 font-semibold mt-1">
                Earn {item.reward}
              </p>
            </div>

            <button
              onClick={() => handleOfferClick(item.link)}
              className="px-5 py-2 rounded-xl bg-green-200 text-slate-900 font-medium hover:bg-green-300 transition active:scale-95"
            >
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 🔝 Navbar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-xl font-semibold text-green-600">
            Andha Paisa 💰
          </h1>

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Profile
          </button>
        </div>
      </div>

      {/* 🔽 Content */}
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
            Earn Rewards
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Play games or complete surveys to earn coins
          </p>
        </div>

        {/* 🔥 Offerwall Card */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-gradient-to-r from-green-200 to-green-300 rounded-2xl shadow-md p-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                🔥 Mega Offerwall
              </h3>
              <p className="text-sm text-slate-700 mt-1">
                Complete high-paying offers & earn up to ₹100+
              </p>
            </div>

            <button
              onClick={() => navigate("/offerwall")}
              className="px-5 py-2 rounded-xl bg-white text-slate-900 font-medium hover:bg-gray-100 transition active:scale-95"
            >
              Start
            </button>
          </div>
        </div>

        {/* Sections */}
        {renderSection("🎮 Games", games)}
        {renderSection("📝 Surveys", surveys)}
      </div>
    </div>
  );
}

export default Dashboard;
