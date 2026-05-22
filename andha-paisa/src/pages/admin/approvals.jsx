import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/common/admin-app-layout";
import { Check, X, Eye } from "lucide-react";

export default function AdminApprovals() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("withdrawable");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Mock data structure - will be replaced by API
  const [tableData, setTableData] = useState({
    withdrawable: [],
    withdraw: [],
    gifts: []
  });

  const tabs = [
    { id: "withdrawable", label: "Withdrawable Points" },
    { id: "withdraw", label: "Withdraw Requests" },
    { id: "gifts", label: "Gift Requests" },
  ];

  // Fetch data based on active tab
  useEffect(() => {
    // Replace with actual API call
    // dispatch(getApprovalsData(activeTab));
    
    // Mock data example - API will return array of objects with any keys
    const mockData = {
      withdrawable: [
        { id: 1, name: "John Doe", email: "john@example.com", points: 2500, eligible: true, lastUpdated: "2024-01-15" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", points: 1800, eligible: true, lastUpdated: "2024-01-14" },
      ],
      withdraw: [
        { id: 1, name: "John Doe", email: "john@example.com", amount: 500, points: 500, bankAccount: "XXXX1234", requestDate: "2024-01-20" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", amount: 1000, points: 1000, bankAccount: "XXXX5678", requestDate: "2024-01-19" },
      ],
      gifts: [
        { id: 1, name: "Mike Johnson", email: "mike@example.com", gift: "Amazon Card", value: 500, points: 500, requestDate: "2024-01-18" },
        { id: 2, name: "John Doe", email: "john@example.com", gift: "Flipkart Voucher", value: 1000, points: 1000, requestDate: "2024-01-17" },
      ]
    };
    
    setTableData(mockData);
  }, [activeTab]);

  const handleApprove = async (item) => {
    if (window.confirm(`Are you sure you want to approve this ${activeTab} item?`)) {
      try {
        // Replace with actual API call
        // await dispatch(approveItem({ tab: activeTab, id: item.id }));
        console.log("Approving:", item);
        alert("Approved successfully!");
        
        // Remove from list or update status
        setTableData(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].filter(i => i.id !== item.id)
        }));
      } catch (error) {
        console.error("Error approving:", error);
        alert("Failed to approve. Please try again.");
      }
    }
  };

  const handleReject = async (item) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      if (window.confirm(`Are you sure you want to reject this ${activeTab} item?`)) {
        try {
          // Replace with actual API call including reason
          // await dispatch(rejectItem({ tab: activeTab, id: item.id, reason }));
          console.log("Rejecting:", item, "Reason:", reason);
          alert("Rejected successfully!");
          
          // Remove from list
          setTableData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(i => i.id !== item.id)
          }));
        } catch (error) {
          console.error("Error rejecting:", error);
          alert("Failed to reject. Please try again.");
        }
      }
    }
  };

  const viewDetails = (item) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const currentData = tableData[activeTab] || [];

  // Get column headers from the first object's keys (excluding 'id')
  const getColumns = () => {
    if (currentData.length === 0) return [];
    const firstItem = currentData[0];
    return Object.keys(firstItem).filter(key => key !== 'id');
  };

  const columns = getColumns();

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Approvals Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage user points, withdrawal requests, and gift redemptions
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 relative
                ${activeTab === tab.id
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}
              {currentData.length > 0 && activeTab === tab.id && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                  {currentData.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {currentData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No items to display</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.replace(/([A-Z])/g, ' $1').trim()}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column} className="px-6 py-4 text-sm text-gray-900">
                        {String(item[column])}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewDetails(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleApprove(item)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(item)}
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
                <h3 className="text-xl font-semibold text-slate-800">Item Details</h3>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-3">
                {Object.entries(selectedItem).map(([key, value]) => (
                  key !== "id" && (
                    <div key={key} className="border-b pb-2">
                      <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm text-gray-900">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </div>
                    </div>
                  )
                ))}
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