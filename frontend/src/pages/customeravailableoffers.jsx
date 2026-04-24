import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, MessageCircle } from "lucide-react";
import axios from "axios";

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

  /* ---------------- DEBUG (IMPORTANT) ---------------- */
  useEffect(() => {
    console.log("📦 LOCATION STATE:", location.state);
    console.log("🔥 FINAL REQUEST ID:", requestId);
  }, [requestId]);

  /* ---------------- FETCH BIDS ---------------- */
  useEffect(() => {
    const fetchBids = async () => {
      try {
        if (!requestId) {
          console.warn("❌ No requestId found. Cannot fetch bids.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:8000/bids/request/${requestId}`
        );

        console.log("📩 BIDS RESPONSE:", res.data);

        setBids(res.data || []);
      } catch (err) {
        console.log("Error fetching bids:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [requestId]);

  /* ---------------- ACCEPT BID ---------------- */
  const handleAccept = async (bidId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.put(
        `http://localhost:8000/bids/${bidId}/status`,
        {
          status: "accepted",
          customer_email: user?.email,
        }
      );

      setAcceptedBid(bidId);

      setTimeout(() => {
        navigate("/customer-dashboard");
      }, 1200);

    } catch (err) {
      console.log("Accept error:", err);
      setAcceptedBid(null);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return createPortal(
      <div className="fixed inset-0 flex justify-center items-center bg-black/30">
        <div className="bg-white p-6 rounded-xl animate-pulse">
          Loading offers...
        </div>
      </div>,
      document.body
    );
  }

  /* ---------------- NO REQUEST ID GUARD ---------------- */
  if (!requestId) {
    return createPortal(
      <div className="fixed inset-0 flex justify-center items-center bg-black/40">
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
      document.body
    );
  }

  /* ---------------- UI ---------------- */
  return createPortal(
    <div className="fixed inset-0 flex justify-center items-start z-50 pointer-events-none">

      <div className="pointer-events-auto relative mt-20 w-[700px] max-w-full rounded-2xl shadow-2xl bg-white p-6">

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
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">

          {bids.map((bid) => (
            <div
              key={bid.id}
              className={`border rounded-xl p-4 transition ${
                acceptedBid === bid.id
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200"
              }`}
            >

              {/* PROVIDER */}
              <div className="flex justify-between items-start mb-2">

                <div className="flex gap-3 items-center">

                  <img
                    src={`https://ui-avatars.com/api/?name=${bid.provider_name}`}
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
                  ${bid.bid_amount}
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

                <button
                  onClick={() =>
                    navigate(`/provider/${bid.provider_email}`)
                  }
                  className="flex-1 py-2 border rounded-xl text-gray-700 hover:bg-gray-100"
                >
                  View Profile
                </button>

                <button className="p-2 border rounded-xl hover:bg-gray-100">
                  <MessageCircle className="w-5 h-5" />
                </button>

              </div>

            </div>
          ))}

        </div>
      </div>
    </div>,
    document.body
  );
}