import { Link } from "react-router";
import { useState } from "react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  ClipboardList, 
  MessageSquare, 
  History, 
  User, 
  LogOut, 
  Wrench,
  DollarSign,
  Clock,
  CheckCircle,
  Eye,
  Star,
  Mail,
  Phone,
  MapPin,
  Edit,
  Camera
} from "lucide-react";

// Mock data for active requests
const activeRequests = [
  {
    id: 1,
    serviceType: "Plumbing",
    description: "Fix leaking kitchen sink",
    budget: "Rs. 3,000 - Rs. 5,000",
    status: "Pending",
    datePosted: "2 hours ago",
    responses: 3,
    location: "Gulberg, Lahore"
  },
  {
    id: 2,
    serviceType: "Electrical",
    description: "Install ceiling fan in bedroom",
    budget: "Rs. 4,000 - Rs. 7,000",
    status: "Accepted",
    datePosted: "1 day ago",
    responses: 5,
    provider: "Usman Ahmed",
    location: "DHA Phase 5, Karachi"
  },
  {
    id: 3,
    serviceType: "Mechanical",
    description: "Car engine diagnostic and repair",
    budget: "Rs. 15,000 - Rs. 25,000",
    status: "In Progress",
    datePosted: "3 days ago",
    responses: 2,
    provider: "Hassan Ali",
    location: "F-7 Markaz, Islamabad"
  },
  {
    id: 4,
    serviceType: "Plumbing",
    description: "Bathroom shower head replacement",
    budget: "Rs. 2,000 - Rs. 3,500",
    status: "Completed",
    datePosted: "5 days ago",
    responses: 4,
    provider: "Imran Khan",
    location: "Bahria Town, Rawalpindi",
    completedDate: "2 days ago",
    rating: null
  },
  {
    id: 5,
    serviceType: "Electrical",
    description: "Fix circuit breaker issues",
    budget: "Rs. 5,000 - Rs. 8,000",
    status: "Completed",
    datePosted: "10 days ago",
    responses: 6,
    provider: "Ali Raza",
    location: "Clifton, Karachi",
    completedDate: "7 days ago",
    rating: 5
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Accepted":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "In Progress":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Completed":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function CustomerDashboard() {
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

  const submitRating = () => {
    console.log("Submitting rating:", { serviceId: selectedService.id, rating, reviewText });
    setShowRatingModal(false);
  };

  const completedServices = activeRequests.filter(req => req.status === "Completed");
  const unratedServices = completedServices.filter(req => !req.rating);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <Link to="/customer-dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">UtilitY</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/customer-dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-100 text-gray-900 font-medium"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            to="/post-request"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-blue-100 hover:text-gray-900 font-medium"
          >
            <PlusCircle className="w-5 h-5" />
            Post New Request
          </Link>
          <Link
            to="/active-requests"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-blue-100 hover:text-gray-900 font-medium"
          >
            <ClipboardList className="w-5 h-5" />
            My Requests
          </Link>
          <Link
            to="/messages"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-blue-100 hover:text-gray-900 font-medium"
          >
            <MessageSquare className="w-5 h-5" />
            Messages
            <span className="ml-auto bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              3
            </span>
          </Link>
          <Link
            to="/history"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-blue-100 hover:text-gray-900 font-medium"
          >
            <History className="w-5 h-5" />
            Service History
          </Link>
          <Link
            to="/customer-profile"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-blue-100 hover:text-gray-900 font-medium"
          >
            <User className="w-5 h-5" />
            My Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, Ahmed!</h1>
              <p className="text-gray-500">Find and hire skilled professionals for your needs</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">Rs. 42,500</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedServices.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">To Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{unratedServices.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Ratings Alert */}
          {unratedServices.length > 0 && (
            <div className="bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-300 rounded-2xl p-8 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">Rate Your Recent Services</h2>
                  <p className="text-lg text-gray-800">
                    You have {unratedServices.length} completed service{unratedServices.length > 1 ? 's' : ''} waiting for your feedback
                  </p>
                </div>
                <button
                  onClick={() => handleRateService(unratedServices[0])}
                  className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-xl shadow-md flex items-center gap-2"
                >
                  <Star className="w-5 h-5" /> Rate Now
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Rating Modal */}
      {showRatingModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Rate Your Service</h3>
            <p className="text-gray-500 mb-2">Service: {selectedService.serviceType}</p>
            <p className="font-semibold text-gray-900 mb-4">Provider: {selectedService.provider}</p>

            <div className="mb-6 flex gap-2 justify-center">
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience..."
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none mb-6"
              rows={4}
            />

            <div className="flex gap-3">
              <button
                onClick={submitRating}
                disabled={rating === 0}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Rating
              </button>
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 border-2 border-gray-200 hover:bg-gray-100 py-3 rounded-xl font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}