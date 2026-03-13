import { Link, useNavigate } from "react-router-dom";
import { 
  PlusCircle, Clock, CheckCircle, RefreshCw, DollarSign
} from "lucide-react";
import { useState } from "react";

// Sample active requests data (plain JS)
const activeRequestsData = [
  {
    id: "REQ-001",
    serviceType: "Plumbing",
    description: "Fix leaking sink",
    status: "pending",
    datePosted: "2026-03-10",
    scheduledDate: "2026-03-12",
    budget: "$50",
    address: "123 Main St",
    responses: 3,
    provider: {
      name: "John Doe",
      image: "/images/john.jpg",
      rating: 4.5,
      phone: "1234567890",
    },
    urgency: "medium"
  },
  {
    id: "REQ-002",
    serviceType: "Electrician",
    description: "Install ceiling fan",
    status: "accepted",
    datePosted: "2026-03-11",
    budget: "$70",
    address: "456 Oak Ave",
    responses: 2,
    urgency: "high"
  },
  {
    id: "REQ-003",
    serviceType: "Carpentry",
    description: "Build a shelf",
    status: "in-progress",
    datePosted: "2026-03-09",
    budget: "$100",
    address: "789 Pine Rd",
    responses: 1,
    urgency: "low"
  }
];

// Status configuration
const getStatusConfig = (status) => {
  switch (status) {
    case "pending":
      return { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock, label: "Pending" };
    case "accepted":
      return { color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle, label: "Accepted" };
    case "in-progress":
      return { color: "bg-purple-100 text-purple-700 border-purple-200", icon: RefreshCw, label: "In Progress" };
    default:
      return { color: "", icon: Clock, label: status };
  }
};

// Urgency color helper
const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case "high": return "bg-red-100 text-red-700 border-red-200";
    case "medium": return "bg-orange-100 text-orange-700 border-orange-200";
    case "low": return "bg-green-100 text-green-700 border-green-200";
    default: return "";
  }
};

export function ActiveRequestsPage() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter requests based on status and search query
  const filteredRequests = activeRequestsData.filter((request) => {
    const matchesFilter = filterStatus === "all" || request.status === filterStatus;
    const matchesSearch = 
      request.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats (optional, for display somewhere)
  const stats = {
    pending: activeRequestsData.filter(r => r.status === "pending").length,
    accepted: activeRequestsData.filter(r => r.status === "accepted").length,
    inProgress: activeRequestsData.filter(r => r.status === "in-progress").length,
    totalResponses: activeRequestsData.reduce((sum, r) => sum + r.responses, 0)
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Sidebar / Filters */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 bg-gray-100 border-2 rounded-xl w-full sm:w-64 mb-2"
        />

        {/* Status filter buttons */}
        <div className="flex gap-2 mb-4">
          {["all", "pending", "accepted", "in-progress"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-xl border ${filterStatus === status ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
            >
              {status === "all" ? "All" : getStatusConfig(status).label}
            </button>
          ))}
        </div>

        {/* New Request Button */}
        <button
          onClick={() => navigate("/customer-dashboard/post-request")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl mt-2"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> New Request
        </button>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">
        {filteredRequests.map((request) => {
          const StatusIcon = getStatusConfig(request.status).icon;
          return (
            <div key={request.id} className="bg-white rounded-2xl border p-6 shadow-sm">
              <div className="flex justify-between mb-2">
                <div>
                  <h3 className="font-bold">{request.serviceType}</h3>
                  <p className="text-sm text-gray-500">{request.id}</p>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{request.description}</p>
              <div className="flex gap-4 text-sm mb-2">
                <div className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {request.budget}</div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {request.datePosted}</div>
              </div>

              {/* Provider info */}
              {request.provider && (
                <div className="bg-gray-50 p-2 rounded-lg mb-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img src={request.provider.image} alt={request.provider.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold">{request.provider.name}</p>
                      <span className="text-yellow-500">★ {request.provider.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${request.provider.phone}`} className="text-green-600">Call</a>
                    <Link to="/messages" className="text-blue-600">Message</Link>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {request.status === "pending" && (
                  <>
                    <button className="flex-1 bg-gray-200 px-4 py-2 rounded-xl">View Offers ({request.responses})</button>
                    <button className="px-3 py-2 text-red-600 border rounded-xl">Cancel</button>
                  </>
                )}
                {request.status === "accepted" && (
                  <>
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl">Contact Provider</button>
                    <button className="flex-1 border px-4 py-2 rounded-xl">Reschedule</button>
                  </>
                )}
                {request.status === "in-progress" && (
                  <>
                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-xl">Mark Complete</button>
                    <button className="px-4 py-2 border rounded-xl">Call</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}