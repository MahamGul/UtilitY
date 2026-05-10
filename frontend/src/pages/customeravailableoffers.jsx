import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Star,
  MessageCircle,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  TrendingUp,
  CheckCircle,
  Award,
} from "lucide-react";
import axios from "axios";
import api from "../services/api";

export function CustomerAvailableOffers() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- SAFE REQUEST ID RESOLUTION ---------------- */
  const requestId =
    location.state?.requestId ||
    location.state?.id ||
    location.state?.requestId?._id ||
    location.state?.request?._id ||
    location.state?._id ||
    null;

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedBid, setAcceptedBid] = useState(null);

  // Provider profile popup state
  const [providerProfile, setProviderProfile] = useState(null);
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerError, setProviderError] = useState("");
  const [showProviderModal, setShowProviderModal] = useState(false);

  /* ---------------- FETCH BIDS ---------------- */
  useEffect(() => {
    const fetchBids = async () => {
      try {
        if (!requestId) {
          setLoading(false);
          return;
        }
        const res = await api.get(`/bids/request/${requestId}`);
        setBids(res.data || []);
      } catch (err) {
        console.log("Error fetching bids:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, [requestId]);

  /* ---------------- FETCH PROVIDER PROFILE ---------------- */
  const handleViewProfile = async (providerEmail) => {
    setProviderProfile(null);
    setProviderError("");
    setProviderLoading(true);
    setShowProviderModal(true);

    try {
      const res = await api.get(`/provider/profile/${providerEmail}`);
      setProviderProfile(res.data);
    } catch (err) {
      setProviderError(
        err?.response?.data?.detail || "Failed to load provider profile.",
      );
    } finally {
      setProviderLoading(false);
    }
  };

  /* ---------------- ACCEPT BID ---------------- */
  const handleAccept = async (bidId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await api.put(`/bids/${bidId}/status`, {
        status: "accepted",
        customer_email: user?.email,
      });
      setAcceptedBid(bidId);
      setTimeout(() => navigate("/customer-dashboard"), 1200);
    } catch (err) {
      console.log("Accept error:", err);
      setAcceptedBid(null);
    }
  };

  const handleClose = () => navigate(-1);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return createPortal(
      <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
        <div className="bg-white p-6 rounded-xl animate-pulse">
          Loading offers...
        </div>
      </div>,
      document.body,
    );
  }

  /* ---------------- NO REQUEST ID GUARD ---------------- */
  if (!requestId) {
    return createPortal(
      <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
        <div className="bg-white p-6 rounded-xl text-center">
          <h2 className="text-lg font-bold text-red-500">
            No Request Selected
          </h2>
          <p className="text-gray-600 mt-2">
            Cannot load bids because requestId is missing.
          </p>
          <button
            onClick={() => navigate("/customer-dashboard")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>,
      document.body,
    );
  }

  /* ---------------- UI ---------------- */
  return createPortal(
    <>
      {/* ============ BIDS MODAL ============ */}
      <div className="fixed inset-0 flex justify-center items-start z-40 bg-black/40">
        <div className="relative mt-16 w-[700px] max-w-full rounded-2xl shadow-2xl bg-white p-6 mx-4">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Service Offers</h2>
              <p className="text-gray-500 text-sm">
                {bids?.[0]?.request_snapshot?.category ?? "Service"} •{" "}
                {bids.length} offers received
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* EMPTY STATE */}
          {bids.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No bids yet for this request
            </div>
          )}

          {/* BIDS LIST */}
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className={`border rounded-xl p-4 transition ${
                  acceptedBid === bid.id
                    ? "border-green-400 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                {/* PROVIDER ROW */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-3 items-center">
                    <img
                      src={`https://ui-avatars.com/api/?name=${bid.provider_name}&background=3b82f6&color=fff`}
                      className="w-12 h-12 rounded-full"
                      alt="provider"
                    />
                    <div>
                      <p className="font-semibold">{bid.provider_name}</p>
                      <p className="text-sm text-gray-500">
                        <Star className="inline w-4 h-4 text-yellow-400 mr-1" />
                        {bid.provider_rating || 0} •{" "}
                        {bid.provider_service_type || "Provider"}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-blue-500 text-lg">
                    Rs. {bid.bid_amount}
                  </p>
                </div>

                {/* MESSAGE */}
                <p className="text-gray-600 text-sm mb-4">
                  {bid.message || "No message provided"}
                </p>

                {/* EXTRA */}
                <div className="text-xs text-gray-500 mb-3">
                  ⏱ {bid.completion_time || "Not specified"} • 📍{" "}
                  {bid.availability || "Not specified"}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(bid.id)}
                    className={`flex-1 py-2 rounded-xl text-white transition ${
                      acceptedBid === bid.id
                        ? "bg-green-500"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={acceptedBid && acceptedBid !== bid.id}
                  >
                    {acceptedBid === bid.id ? "Accepted!" : "Accept Offer"}
                  </button>

                  {/* VIEW PROFILE — opens provider popup */}
                  <button
                    onClick={() => handleViewProfile(bid.provider_email)}
                    className="flex-1 py-2 border rounded-xl text-gray-700 hover:bg-gray-100 transition"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() =>
                      navigate("/customer-dashboard/messages", {
                        state: { otherUser: bid.provider_email },
                      })
                    }
                    className="p-2 border rounded-xl hover:bg-gray-100"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ PROVIDER PROFILE POPUP ============ */}
      {showProviderModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">
                  Provider Profile
                </h3>
                <button
                  onClick={() => setShowProviderModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Loading */}
              {providerLoading && (
                <div className="p-10 text-center text-gray-500 animate-pulse">
                  Loading provider info...
                </div>
              )}

              {/* Error */}
              {providerError && !providerLoading && (
                <div className="p-8 text-center text-red-500">
                  {providerError}
                </div>
              )}

              {/* Profile Content */}
              {providerProfile && !providerLoading && (
                <div className="overflow-y-auto max-h-[80vh]">
                  {/* Blue banner + avatar */}
                  <div className="bg-gradient-to-br from-blue-600 to-blue-400 px-6 pt-6 pb-10 text-white">
                    <div className="flex items-center gap-4">
                      <img
                        src={`https://ui-avatars.com/api/?name=${providerProfile.fullName}&size=80&background=ffffff&color=3b82f6`}
                        className="w-20 h-20 rounded-2xl border-4 border-white/30"
                        alt="provider avatar"
                      />
                      <div>
                        <h4 className="text-2xl font-bold">
                          {providerProfile.fullName || "N/A"}
                        </h4>
                        <p className="text-blue-100 capitalize">
                          {providerProfile.serviceType || "Service Provider"}
                        </p>
                        {providerProfile.isVerified && (
                          <span className="inline-flex items-center gap-1 mt-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats strip */}
                  <div className="grid grid-cols-3 -mt-5 mx-6 bg-white rounded-xl shadow border border-gray-100 divide-x divide-gray-100">
                    <StatBox
                      label="Rating"
                      value={providerProfile.rating || 0}
                      icon={<Star className="w-4 h-4 text-yellow-400" />}
                    />
                    <StatBox
                      label="Jobs Done"
                      value={providerProfile.jobsCompleted || 0}
                      icon={<CheckCircle className="w-4 h-4 text-green-500" />}
                    />
                    <StatBox
                      label="Success Rate"
                      value={`${providerProfile.successRate || 0}%`}
                      icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
                    />
                  </div>

                  {/* Info list */}
                  <div className="px-6 py-5 space-y-3">
                    <ProfileRow
                      icon={<Mail className="w-4 h-4 text-gray-400" />}
                      label="Email"
                      value={providerProfile.email}
                    />
                    <ProfileRow
                      icon={<Phone className="w-4 h-4 text-gray-400" />}
                      label="Phone"
                      value={providerProfile.phone}
                    />
                    <ProfileRow
                      icon={<MapPin className="w-4 h-4 text-gray-400" />}
                      label="Service Area"
                      value={providerProfile.serviceArea}
                    />
                    <ProfileRow
                      icon={<Briefcase className="w-4 h-4 text-gray-400" />}
                      label="Experience"
                      value={
                        providerProfile.experience
                          ? `${providerProfile.experience} year${providerProfile.experience !== 1 ? "s" : ""}`
                          : "Not specified"
                      }
                    />
                    <ProfileRow
                      icon={<Calendar className="w-4 h-4 text-gray-400" />}
                      label="Member Since"
                      value={providerProfile.memberSince}
                    />

                    {/* Skills */}
                    {providerProfile.skills?.length > 0 && (
                      <div className="pt-1">
                        <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                          <Award className="w-4 h-4" /> Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {providerProfile.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer close button */}
                  <div className="px-6 pb-6">
                    <button
                      onClick={() => setShowProviderModal(false)}
                      className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>,
    document.body,
  );
}

/* ================================================================
   SMALL REUSABLE COMPONENTS
================================================================ */
function StatBox({ label, value, icon }) {
  return (
    <div className="flex flex-col items-center py-3 gap-1">
      <div className="flex items-center gap-1">
        {icon}
        <span className="font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800 truncate">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
