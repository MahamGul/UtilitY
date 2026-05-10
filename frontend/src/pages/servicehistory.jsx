import {
  Filter,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Star,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

/* ---------------- STATUS CONFIG ---------------- */
const getStatusConfig = (status) => {
  switch (status) {
    case "completed":
      return {
        color: "bg-green-100 text-green-700",
        icon: CheckCircle,
        label: "Completed",
      };

    case "cancelled":
      return {
        color: "bg-red-100 text-red-700",
        icon: XCircle,
        label: "Cancelled",
      };

    default:
      return {
        color: "bg-yellow-100 text-yellow-700",
        icon: Clock,
        label: "Pending",
      };
  }
};

export default function ServiceHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [services, setServices] = useState([]);

  /* ---------------- MODAL STATES ---------------- */
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bidDetails, setBidDetails] = useState(null);
  const [loadingBid, setLoadingBid] = useState(false);

  const userEmail = localStorage.getItem("email");

  /* ---------------- FETCH HISTORY ---------------- */
  const fetchRequests = useCallback(async () => {
    try {
      const res = await api.get(`/requests/${userEmail}`);

      const data = res.data || [];

      const transformed = data
        .filter(
          (req) => req.status === "completed" || req.status === "cancelled",
        )
        .map((req) => ({
          id: req.id,
          serviceType: req.description || req.category,

          providerName: (
            req.provider_name ||
            req.provider ||
            req.provider_email ||
            "No Provider"
          )
            ?.split("@")[0]
            ?.replace(/^./, (c) => c.toUpperCase()),

          rating: 0,
          date: req.date,
          status: req.status,
          amount: req.status === "completed" ? req.budget : 0,

          // safety fallback so UI never breaks
          fallbackBid: {
            amount: req.budget,
            message: req.description,
            completed_at: req.completed_at || req.date,
          },
        }));

      setServices(transformed);
    } catch (err) {
      console.log("Error fetching history:", err);
    }
}, [userEmail]);

  useEffect(() => {
    if (userEmail) fetchRequests();
  }, [userEmail, fetchRequests]);

  /* ---------------- OPEN DETAILS ---------------- */
  const openDetails = async (service) => {
    setSelectedService(service);
    setOpenModal(true);
    setLoadingBid(true);
    setBidDetails(null);

    try {
      // 1️⃣ Get all bids for this request
      const bidRes = await api.get(`/bids/request/${service.id}`);

      const bids = bidRes.data || [];

      // 2️⃣ Get request data to find accepted bid id
      const reqRes = await api.get(`/requests/${userEmail}`);

      const requests = reqRes.data || [];

      const currentRequest = requests.find((r) => r.id === service.id);

      const acceptedBidId = currentRequest?.accepted_bid_id;

      // 3️⃣ Find accepted bid
      let acceptedBid = bids.find((b) => b.id === acceptedBidId);

      // 4️⃣ FINAL SAFE FALLBACK
      if (!acceptedBid && service.status === "completed") {
        setBidDetails(service.fallbackBid);
      } else if (acceptedBid) {
        setBidDetails({
          amount: acceptedBid.bid_amount,
          message: acceptedBid.message,
          completed_at: acceptedBid.completed_at,
        });
      } else {
        setBidDetails(null);
      }
    } catch (err) {
      console.log("Error fetching bid details:", err);

      // 🔥 NEVER fail for completed jobs
      if (service.status === "completed") {
        setBidDetails(service.fallbackBid);
      } else {
        setBidDetails(null);
      }
    } finally {
      setLoadingBid(false);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredServices = services
    .filter((service) => {
      if (filter === "all") return true;
      return service.status === filter;
    })
    .filter(
      (service) =>
        service.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.providerName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        service.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const totalSpent = filteredServices
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => sum + s.amount, 0);

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Service History</h1>
        </div>

        <div className="text-right">
          <p className="text-gray-500 text-sm">Total Spent</p>
          <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-4 text-left">Service</th>
              <th className="p-4 text-left">Provider</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredServices.map((service) => {
              const statusConfig = getStatusConfig(service.status);
              const StatusIcon = statusConfig.icon;

              return (
                <tr key={service.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-semibold">{service.serviceType}</td>

                  <td className="p-4 text-sm">{service.providerName}</td>

                  <td className="p-4 text-sm">
                    {new Date(service.date).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </td>

                  <td className="p-4 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {service.amount.toFixed(2)}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => openDetails(service)}
                      className="flex items-center gap-1 text-blue-600 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-3">Service Details</h2>

            {selectedService && (
              <div className="text-sm space-y-2">
                <p>
                  <b>Service:</b> {selectedService.serviceType}
                </p>
                <p>
                  <b>Provider:</b> {selectedService.providerName}
                </p>
                <p>
                  <b>Status:</b> {selectedService.status}
                </p>
              </div>
            )}

            <hr className="my-3" />

            {loadingBid ? (
              <p>Loading bid details...</p>
            ) : bidDetails ? (
              <div className="text-sm space-y-2">
                <p>
                  <b>Accepted Bid:</b> ${bidDetails.amount}
                </p>
                <p>
                  <b>Message:</b> {bidDetails.message || "No message"}
                </p>
                <p>
                  <b>Completed On:</b> {bidDetails.completed_at || "N/A"}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No bid details available.</p>
            )}

            <button
              onClick={() => setOpenModal(false)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
