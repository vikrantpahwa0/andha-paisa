import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/common/admin-app-layout";
import { Check, X, Eye, Clock, User, Calendar, DollarSign } from "lucide-react";
import {
  getAdminWithdrawals,
  updateAdminWithdrawalStatus,
  clearAdminWithdrawalError,
  clearAdminWithdrawalSuccess,
} from "../../store/slices/admin/withdrawals";

export default function WithdrawalRequests() {
  const dispatch = useDispatch();
  const { withdrawals, isLoading, error, successMessage } = useSelector(
    (state) => state.adminWithdrawals
  );

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch withdrawal requests on component mount
  useEffect(() => {
    dispatch(getAdminWithdrawals());
  }, [dispatch]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearAdminWithdrawalSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearAdminWithdrawalError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const getFilteredRequests = () => {
    let filtered = [...withdrawals];

    // Apply search - search by user name, user_id, or transaction ID
    if (searchTerm) {
      filtered = filtered.filter(
        (w) =>
          w.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.user_id?.toString().includes(searchTerm.toLowerCase()) ||
          w.id?.toString().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((w) => w.status === filterStatus);
    }

    return filtered;
  };

  const handleStatusUpdate = async (withdrawal, status) => {
    const userName = withdrawal.user?.name || `User ${withdrawal.user_id}`;
    const confirmMessage =
      status === "CONFIRMED"
        ? `Confirm withdrawal request #${withdrawal.id} for ${userName}?`
        : `Reject withdrawal request #${withdrawal.id} for ${userName}?`;

    if (window.confirm(confirmMessage)) {
      try {
        await dispatch(
          updateAdminWithdrawalStatus({
            withdrawalId: withdrawal.id,
            status: status,
          })
        ).unwrap();
        setIsDetailModalOpen(false);
        setSelectedItem(null);
      } catch (error) {
        console.error(`Error updating withdrawal status:`, error);
        // Error is handled by the slice and displayed via error state
      }
    }
  };

  const openDetailModal = (withdrawal) => {
    setSelectedItem(withdrawal);
    setIsDetailModalOpen(true);
  };

  const filteredRequests = getFilteredRequests();

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    PENDING: Clock,
    CONFIRMED: Check,
    REJECTED: X,
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Withdrawal Requests
        </h1>
        <p className="text-sm text-gray-500">
          Manage and process user withdrawal requests
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

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by User Name, User ID or Transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold text-slate-700">
            {withdrawals.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-emerald-600">
            ₹
            {withdrawals.reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {withdrawals.filter((w) => w.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">
            {withdrawals.filter((w) => w.status === "CONFIRMED").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading withdrawal requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No withdrawal requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount (₹)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((withdrawal) => {
                  const StatusIcon = statusIcons[withdrawal.status] || Clock;
                  const userName = withdrawal.user?.name || `User ${withdrawal.user_id}`;
                  const userInitial = getUserInitials(withdrawal.user?.name);
                  
                  return (
                    <tr key={withdrawal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{withdrawal.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium text-sm">
                            {userInitial}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {userName}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {withdrawal.user_id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-slate-900">
                            ₹{parseFloat(withdrawal.amount).toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[withdrawal.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <StatusIcon size={14} />
                          {withdrawal.status || "PENDING"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar size={14} className="text-gray-400" />
                          {withdrawal.created_at
                            ? new Date(withdrawal.created_at).toLocaleString()
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetailModal(withdrawal)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {withdrawal.status === "PENDING" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(withdrawal, "CONFIRMED")
                                }
                                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Confirm"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(withdrawal, "REJECTED")
                                }
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Reject"
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                  Withdrawal Request Details
                </h3>
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    Request Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>
                      <span className="text-gray-500">ID:</span> #{selectedItem.id}
                    </p>
                    <p>
                      <span className="text-gray-500">Status:</span>{" "}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[selectedItem.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedItem.status || "PENDING"}
                      </span>
                    </p>
                    <p className="col-span-2">
                      <span className="text-gray-500">User:</span>{" "}
                      <span className="font-medium">
                        {selectedItem.user?.name || `User ${selectedItem.user_id}`}
                      </span>
                      <span className="text-gray-400 text-xs ml-2">
                        (ID: {selectedItem.user_id})
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Amount:</span>{" "}
                      <span className="font-semibold text-emerald-600">
                        ₹{parseFloat(selectedItem.amount).toFixed(2)}
                      </span>
                    </p>
                    <p className="col-span-2">
                      <span className="text-gray-500">Requested At:</span>{" "}
                      {selectedItem.created_at
                        ? new Date(selectedItem.created_at).toLocaleString()
                        : "N/A"}
                    </p>
                    <p className="col-span-2">
                      <span className="text-gray-500">Updated At:</span>{" "}
                      {selectedItem.updated_at
                        ? new Date(selectedItem.updated_at).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                {selectedItem.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedItem, "REJECTED");
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedItem, "CONFIRMED");
                      }}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Confirm
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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