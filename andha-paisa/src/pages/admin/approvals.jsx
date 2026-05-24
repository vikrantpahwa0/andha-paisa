import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/common/admin-app-layout";
import { Check, X } from "lucide-react";
import {
  getWithdrawableTransactions,
  approveRejectTransaction,
  clearError,
  clearSuccessMessage,
} from "../../store/slices/approvals";

export default function AdminApprovals() {
  const dispatch = useDispatch();
  const { withdrawableTransactions, isLoading, error, successMessage } =
    useSelector((state) => state.approvals);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch withdrawable transactions on component mount
  useEffect(() => {
    dispatch(getWithdrawableTransactions());
  }, [dispatch]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const getFilteredTransactions = () => {
    let filtered = [...withdrawableTransactions];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.transactionSurvey?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  };

  const handleApprove = async (transaction) => {
    if (
      window.confirm(
        `Approve transaction for ${transaction.user?.name}? This will mark the survey as completed and add points to their wallet.`,
      )
    ) {
      try {
        await dispatch(
          approveRejectTransaction({
            surveyTransactionId: transaction.id,
            status: "COMPLETED",
          }),
        ).unwrap();
        await dispatch(getWithdrawableTransactions());
      } catch (error) {
        console.error("Error approving:", error);
        alert(error || "Failed to approve. Please try again.");
      }
    }
  };

  const handleReject = async (transaction) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      if (window.confirm(`Reject transaction for ${transaction.user?.name}?`)) {
        try {
          await dispatch(
            approveRejectTransaction({
              surveyTransactionId: transaction.id,
              status: "REJECTED",
            }),
          ).unwrap();
          await dispatch(getWithdrawableTransactions());
        } catch (error) {
          console.error("Error rejecting:", error);
          alert(error || "Failed to reject. Please try again.");
        }
      }
    }
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Withdrawable Transactions
        </h1>
        <p className="text-sm text-gray-500">
          Review and approve user survey completions to make them eligible for
          withdrawals
        </p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by user name or survey name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-bold text-slate-700">
            {withdrawableTransactions.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Reward Amount</p>
          <p className="text-2xl font-bold text-emerald-600">
            ₹
            {withdrawableTransactions.reduce(
              (sum, t) => sum + (parseInt(t.transactionSurvey?.reward) || 0),
              0,
            )}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Unique Users</p>
          <p className="text-2xl font-bold text-slate-700">
            {new Set(withdrawableTransactions.map((t) => t.user?.name)).size}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No withdrawable transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Survey
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reward (₹)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        #{transaction.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.user?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {transaction.transactionSurvey?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-emerald-600">
                        ₹{transaction.transactionSurvey?.reward || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {transaction.completed_at
                        ? new Date(
                            transaction.completed_at,
                          ).toLocaleDateString()
                        : "Pending"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(transaction)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(transaction)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800">
                  Transaction Details
                </h3>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    Transaction Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>
                      <span className="text-gray-500">Transaction ID:</span>{" "}
                      {selectedItem.id}
                    </p>
                    <p>
                      <span className="text-gray-500">Completed At:</span>{" "}
                      {selectedItem.completed_at
                        ? new Date(selectedItem.completed_at).toLocaleString()
                        : "Not completed"}
                    </p>
                  </div>
                </div>

                <div className="border-b pb-3">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    User Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>
                      <span className="text-gray-500">Name:</span>{" "}
                      {selectedItem.user?.name || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="border-b pb-3">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    Survey Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>
                      <span className="text-gray-500">Survey Name:</span>{" "}
                      {selectedItem.transactionSurvey?.name || "N/A"}
                    </p>
                    <p>
                      <span className="text-gray-500">Reward:</span> ₹
                      {selectedItem.transactionSurvey?.reward || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    handleReject(selectedItem);
                    setIsDetailModalOpen(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedItem);
                    setIsDetailModalOpen(false);
                  }}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
