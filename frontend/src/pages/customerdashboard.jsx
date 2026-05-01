import { useState, useEffect } from "react";
import { Clock, CheckCircle, Star, Loader } from "lucide-react";
export default function CustomerDashboard() {

  // ---------------- USER ----------------
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error("Invalid user in localStorage");
      }
    }
  }, []);

  // ---------------- NAME FORMAT ----------------
  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) {
      const name = user.email.split("@")[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return "User";
  };

  // ---------------- SERVICE TYPE ----------------
  const [serviceType, setServiceType] = useState("carpenter");

  // ---------------- DATA ----------------
  const [activeRequests, setActiveRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (!user?.email) return;
        const res = await fetch(`http://127.0.0.1:8000/requests/${user.email}`);
        const data = await res.json();
        const normalized = data.map(item => ({
          ...item,
          id: item.id || item._id,
          status: item.status?.toLowerCase(),
          feedback_given: item.feedback_given ?? false
        }));
        setActiveRequests(normalized);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();
  }, [user]);

  // ---------------- TOP PROVIDERS ----------------
  const [topProviders, setTopProviders] = useState([]);

  useEffect(() => {
    const fetchTopProviders = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/provider/top?serviceType=${serviceType}`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setTopProviders(data);
        } else {
          setTopProviders([]);
        }
      } catch (err) {
        console.error(err);
        setTopProviders([]);
      }
    };
    fetchTopProviders();
  }, [serviceType]);

  // ---------------- FILTERS ----------------
  const pending = activeRequests.filter(r => r.status === "pending");
  const inProgress = activeRequests.filter(r => r.status === "in_progress");
  const completed = activeRequests.filter(r => r.status === "completed");
  const unrated = completed.filter(r => r.feedback_given === false);

  // ---------------- RATING STATES ----------------
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleRateService = (service) => {
    setSelectedService(service);
    setShowRatingModal(true);
    setRating(0);
    setReviewText("");
  };

  const closeModal = () => {
    setShowRatingModal(false);
    setSelectedService(null);
    setRating(0);
    setReviewText("");
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const submitRating = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: selectedService.id,
          customer_email: user.email,
          rating,
          comment: reviewText
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || "Error submitting feedback");
        return;
      }
      setActiveRequests(prev =>
        prev.map(r =>
          r.id === selectedService.id ? { ...r, feedback_given: true } : r
        )
      );
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white px-8 py-6 flex justify-between items-center border-b">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome Back, {getDisplayName()}!
          </h1>
          <p className="text-gray-500">
            Find and hire skilled professionals for your needs
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-gray-500 text-sm">Total Spent</p>
            <p className="font-bold text-lg">Rs. 42,500</p>
          </div>
          <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center text-white font-bold">
            {getDisplayName().charAt(0)}
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="p-8 grid grid-cols-4 gap-6">
        <StatCard title="Pending"     count={pending.length}    icon={<Clock />}        color="bg-yellow-100 text-yellow-600" />
        <StatCard title="In Progress" count={inProgress.length} icon={<Loader />}       color="bg-purple-100 text-purple-600" />
        <StatCard title="Completed"   count={completed.length}  icon={<CheckCircle />}  color="bg-green-100 text-green-600" />
        <StatCard title="To Rate"     count={unrated.length}    icon={<Star />}         color="bg-orange-100 text-orange-600" />
      </div>

      {/* SERVICE TYPE SELECTOR */}
      <div className="mx-8 mt-6">
        <label className="font-semibold mr-2">Select Service Type:</label>
        <select
          className="border p-2 rounded"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        >
          <option value="carpenter">Carpenter</option>
          <option value="plumber">Plumber</option>
          <option value="electrician">Electrician</option>
          <option value="mechanic">Mechanic</option>
          <option value="general repair">General Repair</option>
        </select>
      </div>

      {/* TOP PROVIDERS */}
      {topProviders.length > 0 && (
        <div className="mx-8 mt-6 bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">
            ⭐ Top {serviceType}s for You
          </h2>
          <div className="grid gap-3">
            {topProviders.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{p.fullName}</p>
                  <p className="text-sm text-gray-500">
                    ⭐ {p.rating} • {p.jobsCompleted} jobs
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{p.badge}</p>
                  <p className="text-xs text-gray-400">
                    Score: {p.score.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RATE COMPLETED SERVICES */}
      {unrated.length > 0 && (
        <div className="mx-8 mt-6">
          <h2 className="text-xl font-bold mb-4">
            Rate Your Completed Services
          </h2>
          <div className="grid gap-4">
            {unrated.map(service => (
              <div
                key={service.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold capitalize">{service.category}</p>
                  <p className="text-gray-500 text-sm">{service.description}</p>
                  <p className="text-gray-400 text-xs">
                    {service.date} • {service.time}
                  </p>
                  <p className="text-xs text-gray-400">
                    Provider: {service.provider_email}
                  </p>
                </div>
                <button
                  onClick={() => handleRateService(service)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                >
                  Rate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RATING MODAL */}
      {showRatingModal && selectedService && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-xl w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-2">Rate Service</h2>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className={`w-8 h-8 cursor-pointer ${
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <textarea
              className="w-full border p-2 rounded"
              rows={4}
              placeholder="Write review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={closeModal}
                className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={rating === 0}
                className="w-1/2 bg-blue-600 text-white py-2 rounded disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

// ---------------- STAT CARD ----------------
function StatCard({ title, count, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  );
}