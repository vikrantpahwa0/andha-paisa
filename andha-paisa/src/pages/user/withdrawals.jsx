// src/pages/Withdraw.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Banknote,
  History,
} from "lucide-react";
import AppLayout from "../../components/common/app-layout";
import { fetchUserEarnings } from "../../store/slices/user-earnings";

// Mock data - replace with actual API calls
const mockWithdrawalRequests = [
  {
    id: 1,
    amount: 400,
    status: "completed", // completed, pending, failed
    date: "2026-06-28T10:30:00Z",
    transactionId: "TXN123456",
  },
  {
    id: 2,
    amount: 200,
    status: "pending",
    date: "2026-06-30T14:20:00Z",
    transactionId: null,
  },
  {
    id: 3,
    amount: 800,
    status: "failed",
    date: "2026-06-25T09:15:00Z",
    transactionId: null,
  },
];

const AMOUNT_OPTIONS = [200, 400, 800, 1600];

export default function Withdraw() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { confirmedPoints, withdrawLimit, isLoading, completedAmount } = useSelector(
    (state) => state.earnings
  );
  
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawalRequests, setWithdrawalRequests] = useState(mockWithdrawalRequests);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    dispatch(fetchUserEarnings());
    // Fetch withdrawal history from API
    // fetchWithdrawalHistory();
  }, [dispatch]);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setErrorMessage("");
  };

  const getDisplayAmount = () => {
    return selectedAmount || 0;
  };

  const handleSubmit = async () => {

    const amount = getDisplayAmount();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Replace with actual API call
      // await api.withdraw({ amount });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Add new withdrawal request to list
      const newRequest = {
        id: Date.now(),
        amount: amount,
        status: "pending",
        date: new Date().toISOString(),
        transactionId: null,
      };
      
      setWithdrawalRequests([newRequest, ...withdrawalRequests]);
      setSuccessMessage(`Withdrawal request of ₹${amount} submitted successfully!`);
      setSelectedAmount(null);
      
      // Refresh earnings
      dispatch(fetchUserEarnings());
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setErrorMessage("Failed to submit withdrawal request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        label: "Pending",
        className: "text-yellow-600 bg-yellow-50 border-yellow-200",
        iconClassName: "text-yellow-600",
      },
      completed: {
        icon: CheckCircle,
        label: "Completed",
        className: "text-green-600 bg-green-50 border-green-200",
        iconClassName: "text-green-600",
      },
      failed: {
        icon: XCircle,
        label: "Failed",
        className: "text-red-600 bg-red-50 border-red-200",
        iconClassName: "text-red-600",
      },
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-semibold text-slate-800">Withdraw</h1>
          <p className="text-gray-500 text-sm mt-1">
            Convert your points to real money. Minimum withdrawal: ₹{withdrawLimit}
          </p>
        </div>

        {/* Withdraw Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Select Amount
            </h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-600">
                Available: <span className="font-semibold text-slate-800">₹{completedAmount}</span>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600">
                Limit: <span className="font-semibold text-slate-800">₹{withdrawLimit}</span>
              </span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {AMOUNT_OPTIONS.map((amount) => {
              const isSelected = selectedAmount === amount;
              const isDisabled = amount > completedAmount;
              
              return (
                <button
                  key={amount}
                  onClick={() => !isDisabled && handleAmountSelect(amount)}
                  disabled={isDisabled}
                  className={`
                    py-3 px-4 rounded-xl font-semibold transition-all duration-200
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-slate-900 shadow-md scale-105"
                        : isDisabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-50 text-slate-700 hover:bg-gray-100 border-2 border-transparent hover:border-green-300"
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Banknote className="w-4 h-4" />
                    ₹{amount}
                  </div>
                  {isDisabled && (
                    <p className="text-xs mt-1">Insufficient</p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Error/Success Messages */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-600 text-sm mb-4">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || getDisplayAmount() === 0}
            className="w-full py-3.5 rounded-xl font-semibold text-slate-900 transition-all duration-200
              bg-gradient-to-r from-green-200 via-green-300 to-green-400
              hover:from-green-300 hover:to-green-500
              active:scale-95 shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                <span>Withdraw ₹{getDisplayAmount() || 0}</span>
              </>
            )}
          </button>
        </div>

        {/* Withdrawal History */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">
              Withdrawal History
            </h2>
          </div>

          {withdrawalRequests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
              <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No withdrawal requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawalRequests.map((request) => {
                const statusConfig = getStatusConfig(request.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div
                    key={request.id}
                    className={`bg-white rounded-2xl shadow-sm border p-5 ${statusConfig.className}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${statusConfig.className}`}>
                          <StatusIcon className={`w-5 h-5 ${statusConfig.iconClassName}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">
                              ₹{request.amount}
                            </span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig.className}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {formatDate(request.date)}
                          </p>
                        </div>
                      </div>
                      
                      {request.transactionId && (
                        <div className="text-xs text-slate-500">
                          <span className="font-medium">Txn ID:</span> {request.transactionId}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}