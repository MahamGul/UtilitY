import { Link, useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Clock,
  CheckCircle,
  RefreshCw,
  DollarSign
} from "lucide-react";
import { useState } from "react";

/* ---------------- SAMPLE DATA ---------------- */

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

    case "in-progress":
      return {
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: RefreshCw,
        label: "In Progress"
      };

    default:
      return {
        color: "",
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


  /* ------------ FILTERING ------------ */

  const filteredRequests = activeRequestsData.filter((request) => {

    const matchesFilter =
      filterStatus === "all" || request.status === filterStatus;

    const matchesSearch =
      request.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });


  /* ------------ STATS ------------ */

  const stats = {
    pending: activeRequestsData.filter(r => r.status === "pending").length,
    accepted: activeRequestsData.filter(r => r.status === "accepted").length,
    inProgress: activeRequestsData.filter(r => r.status === "in-progress").length,
    totalResponses: activeRequestsData.reduce((sum, r) => sum + r.responses, 0)
  };


  /* ------------ UI ------------ */

  return (

    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-2xl font-bold">
            Active Requests
          </h1>

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



      {/* STATS CARDS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-3">

          <Clock className="text-yellow-600" />

          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="font-bold text-lg">{stats.pending}</p>
          </div>

        </div>


        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-3">

          <CheckCircle className="text-blue-600" />

          <div>
            <p className="text-sm text-gray-500">Accepted</p>
            <p className="font-bold text-lg">{stats.accepted}</p>
          </div>

        </div>


        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-3">

          <RefreshCw className="text-purple-600" />

          <div>
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="font-bold text-lg">{stats.inProgress}</p>
          </div>

        </div>


        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-3">

          <DollarSign className="text-green-600" />

          <div>
            <p className="text-sm text-gray-500">Total Offers</p>
            <p className="font-bold text-lg">{stats.totalResponses}</p>
          </div>

        </div>

      </div>



      {/* SEARCH + FILTER */}

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

        {/* FILTER BUTTONS */}

        <div className="flex gap-2 flex-wrap">

          {["all", "pending", "accepted", "in-progress"].map((status) => (

            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl border text-sm transition
              ${filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {status === "all"
                ? "All Requests"
                : getStatusConfig(status).label}
            </button>

          ))}

        </div>


        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search requests..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          className="h-11 px-4 rounded-xl border bg-white w-full md:w-72"
        />

      </div>



      {/* REQUESTS GRID */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredRequests.map((request) => {

          const statusConfig = getStatusConfig(request.status);
          const StatusIcon = statusConfig.icon;

          return (

            <div
              key={request.id}
              className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition"
            >

              {/* CARD HEADER */}

              <div className="flex justify-between mb-2">

                <div>
                  <h3 className="font-semibold text-lg">
                    {request.serviceType}
                  </h3>

                  <p className="text-xs text-gray-400">
                    {request.id}
                  </p>
                </div>


                <span
                  className={`px-2 py-1 text-xs rounded-lg border ${getUrgencyColor(
                    request.urgency
                  )}`}
                >
                  {request.urgency}
                </span>

              </div>



              {/* DESCRIPTION */}

              <p className="text-gray-600 text-sm mb-4">
                {request.description}
              </p>



              {/* INFO */}

              <div className="flex gap-4 text-sm text-gray-500 mb-4">

                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {request.budget}
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {request.datePosted}
                </div>

              </div>



              {/* STATUS BADGE */}

              <div
                className={`flex items-center gap-2 text-xs px-3 py-1 rounded-lg border w-fit mb-4 ${statusConfig.color}`}
              >
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </div>



              {/* PROVIDER */}

              {request.provider && (

                <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center mb-4">

                  <div className="flex items-center gap-2">

                    <img
                      src={request.provider.image}
                      alt={request.provider.name}
                      className="w-9 h-9 rounded-full"
                    />

                    <div>
                      <p className="text-sm font-semibold">
                        {request.provider.name}
                      </p>

                      <p className="text-xs text-yellow-500">
                        ★ {request.provider.rating}
                      </p>
                    </div>

                  </div>


                  <div className="flex gap-2 text-sm">

                    <a
                      href={`tel:${request.provider.phone}`}
                      className="text-green-600"
                    >
                      Call
                    </a>

                    <Link
                      to="/messages"
                      className="text-blue-600"
                    >
                      Message
                    </Link>

                  </div>

                </div>

              )}



              {/* ACTION BUTTONS */}

              <div className="flex gap-2">

                {request.status === "pending" && (
                  <>
                    <button className="flex-1 bg-gray-100 px-3 py-2 rounded-xl text-sm">
                      View Offers ({request.responses})
                    </button>

                    <button className="px-3 py-2 border rounded-xl text-red-600 text-sm">
                      Cancel
                    </button>
                  </>
                )}



                {request.status === "accepted" && (
                  <>
                    <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-xl text-sm">
                      Contact Provider
                    </button>

                    <button className="flex-1 border px-3 py-2 rounded-xl text-sm">
                      Reschedule
                    </button>
                  </>
                )}



                {request.status === "in-progress" && (
                  <>
                    <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-xl text-sm">
                      Mark Complete
                    </button>

                    <button className="px-3 py-2 border rounded-xl text-sm">
                      Call
                    </button>
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