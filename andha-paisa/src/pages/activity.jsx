import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/common/app-layout";
import {
  Trophy,
  RotateCw,
  Calendar,
  Coins,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { fetchTransactions } from "../store/slices/activity-slice";

export default function Activity() {
  const dispatch = useDispatch();
  const { surveyTransactions, miniGamesTransactions, isLoading, error } =
    useSelector((state) => state.activity);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Combine and unify transactions
  const allTransactions = [
    ...surveyTransactions.map((tx, idx) => ({
      id: `survey-${tx.created_at}-${idx}`,
      type: "survey",
      title: tx.name,
      points: tx.total_points,
      status: tx.status,
      created_at: tx.created_at,
    })),
    ...miniGamesTransactions.map((tx, idx) => ({
      id: `spin-${tx.created_at}-${idx}`,
      type: "spin",
      title: tx.name,
      points: tx.value,
      status: null,
      created_at: tx.created_at,
    })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filteredTransactions = allTransactions.filter((tx) => {
    if (filter === "all") return true;
    return tx.type === filter;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getSurveyStyles = (status) => {
    if (status === "COMPLETED") {
      return {
        bg: "bg-emerald-100",
        icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
        textColor: "text-emerald-600",
        statusText: "Completed",
      };
    }
    if (status === "REJECTED") {
      return {
        bg: "bg-red-100",
        icon: <XCircle className="w-5 h-5 text-red-600" />,
        textColor: "text-red-600",
        statusText: "Rejected",
      };
    }
    // ATTEMPTED/ASSIGNED – treat as "In review"
    return {
      bg: "bg-amber-100",
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      textColor: "text-amber-600",
      statusText: "In review",
    };
  };

  if (isLoading && allTransactions.length === 0) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          Error: {error}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Your Activity</h1>
          <p className="text-slate-500 text-sm mt-1">
            All your spins and survey earnings
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm w-fit">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "all"
                ? "bg-green-100 text-green-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("spin")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
              filter === "spin"
                ? "bg-green-100 text-green-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <RotateCw className="w-4 h-4" />
            Spins
          </button>
          <button
            onClick={() => setFilter("survey")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
              filter === "survey"
                ? "bg-green-100 text-green-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Surveys
          </button>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border">
              <Coins className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No transactions for this filter.</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isSurvey = tx.type === "survey";
              const surveyStyle = isSurvey ? getSurveyStyles(tx.status) : null;

              return (
                <div
                  key={tx.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center justify-between hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon with dynamic background */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isSurvey ? surveyStyle.bg : "bg-emerald-100"
                      }`}
                    >
                      {isSurvey ? (
                        surveyStyle.icon
                      ) : (
                        <RotateCw className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{tx.title}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(tx.created_at)}</span>
                        {isSurvey && (
                          <span
                            className={`ml-1 text-xs font-medium ${surveyStyle.textColor}`}
                          >
                            • {surveyStyle.statusText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {tx.points > 0 ? (
                      <p className="font-bold text-green-600">
                        +{tx.points} pts
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400">No points</p>
                    )}
                    <p className="text-xs text-slate-400 capitalize mt-1">
                      {tx.type}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {filteredTransactions.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-500">
            Showing {filteredTransactions.length} transactions
          </div>
        )}
      </div>
    </AppLayout>
  );
}
