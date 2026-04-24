import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Clock,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

/* ---------------- HELPERS ---------------- */
const getStatusConfig = (status) => {
  switch (status) {
    case "pending":
      return {
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: Clock,
        label: "Pending"
      };
    case "accepted":
      return {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: CheckCircle,
        label: "Accepted"
      };
    case "in_progress":
      return {
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: RefreshCw,
        label: "In Progress"
      };
    default:
      return {
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: Clock,
        label: status
      };
  }
};

const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case "high":
      return "bg-red-100 text-red-700 border-red-200";
    case "medium":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "low":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "";
  }
};

/* ---------------- COMPONENT ---------------- */
export function ActiveRequestsPage() {
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState([]);

  const userEmail = JSON.parse(localStorage.getItem("user"))?.email;

  /* ---------------- FETCH REQUESTS ---------------- */
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/requests/${userEmail}`
        );

        setRequests(res.data || []);
      } catch (err) {
        console.log("Error fetching requests:", err);
      }
    };

    if (userEmail) fetchRequests();
  }, [userEmail]);

  /* ---------------- FILTER ---------------- */
  const filteredRequests = requests.filter((request) => {
    const matchesFilter =
      filterStatus === "all" || request.status === filterStatus;

    const matchesSearch =
      (request.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.id || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Active Requests</h1>
          <p className="text-gray-500">
            Track and manage your ongoing service requests
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/customer-dashboard/post-request")
          }
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          New Request
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "accepted", "in_progress"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl border text-sm transition
              ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* REQUEST LIST */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredRequests.map((request) => {
          const statusConfig = getStatusConfig(request.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={request.id}
              className="bg-white rounded-2xl border p-5 shadow-sm"
            >

              {/* HEADER */}
              <div className="flex justify-between">
                <h3 className="font-semibold">{request.category}</h3>

                <span className={`px-2 py-1 text-xs rounded-lg border ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency || "normal"}
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 mt-2">
                {request.description}
              </p>

              {/* INFO */}
              <div className="flex gap-3 text-sm text-gray-500 mt-3">
                <span>💰 {request.budget}</span>
                <span>📅 {request.date}</span>
              </div>

              {/* STATUS */}
              <div className={`flex items-center gap-2 text-xs px-3 py-1 rounded-lg border w-fit mt-4 ${statusConfig.color}`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </div>

              {/* ACTIONS */}
              <div className="mt-4">

                {request.status === "pending" && (
                  <button
                    className="w-full bg-gray-100 py-2 rounded-xl text-sm"
                    onClick={() =>
                      navigate("/customer-available-offers", {
                        state: {
                          requestId: request.id   // ✅ FIXED HERE
                        }
                      })
                    }
                  >
                    View Offers
                  </button>
                )}

                {request.status === "accepted" && (
                  <button className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm">
                    Contact Provider
                  </button>
                )}

                {request.status === "in_progress" && (
                  <button className="w-full bg-green-600 text-white py-2 rounded-xl text-sm">
                    Mark Complete
                  </button>
                )}

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}