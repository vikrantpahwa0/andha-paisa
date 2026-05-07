import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Wallet, 
  Gift, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Lock
} from "lucide-react";

const EarningsSidebar = ({ confirmedAmount = 120, reviewAmount = 40 }) => {
  const navigate = useNavigate();
  const withdrawalLimit = 500;
  const canWithdraw = confirmedAmount >= withdrawalLimit;
  const progressPercent = Math.min(100, (confirmedAmount / withdrawalLimit) * 100);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleWithdrawClick = () => {
    if (canWithdraw) {
      navigate("/profile");
    } else {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Confirmed Section */}
      <div className="bg-gradient-to-br from-green-200 via-green-300 to-green-400 rounded-2xl shadow-md p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-slate-700" />
            <h4 className="text-sm text-slate-700 font-medium">Confirmed</h4>
          </div>
        </div>
        <p className="text-3xl font-bold mt-2 text-slate-900">₹{confirmedAmount}</p>
        <p className="text-xs text-slate-600 mt-1">Earnings that have been verified</p>

        {/* Withdraw Button */}
        <div className="relative mt-4">
          <button
            onClick={handleWithdrawClick}
            className="relative w-full rounded-xl transition active:scale-95 focus:outline-none bg-white border-[12px] border-white shadow-sm overflow-hidden"
          >
            <div className="relative w-full rounded-lg overflow-hidden bg-white/90">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500/40 to-green-500/40 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
              <div className="relative z-10 flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-slate-800" />
                  <span className="font-semibold text-slate-800">Withdraw</span>
                </div>
                <span className="text-sm font-mono text-slate-700 bg-white/60 px-2 py-0.5 rounded-full">
                  ₹{confirmedAmount}/{withdrawalLimit}
                </span>
              </div>
            </div>
          </button>

          {showTooltip && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 flex items-center gap-1.5 whitespace-nowrap z-20 shadow-lg">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Amount is withdrawable at ₹{withdrawalLimit}</span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}
        </div>

        {/* Use Points Button */}
        <button
          onClick={() => navigate("/use-points")}
          className="w-full mt-3 py-2.5 rounded-xl font-semibold transition active:scale-95 bg-white/80 text-slate-800 hover:bg-white shadow-md border-[12px] border-white flex items-center justify-center gap-2"
        >
          <Gift className="w-5 h-5" />
          Use Points
        </button>
      </div>

      {/* In Review Section */}
      <div className="bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 rounded-2xl shadow-md p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            <h4 className="text-sm text-slate-700 font-medium">In Review</h4>
          </div>
          <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full text-slate-700">
            Pending
          </span>
        </div>
        <p className="text-3xl font-bold mt-2 text-slate-900">₹{reviewAmount}</p>
        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Awaiting approval (usually 2 - 4 hrs)
        </p>
      </div>
    </div>
  );
};

export default EarningsSidebar;