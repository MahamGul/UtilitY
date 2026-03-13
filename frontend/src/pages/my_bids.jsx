import { Link } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  History,
  User,
  LogOut,
  Wrench,
  DollarSign,
  MapPin,
  Clock,
  Star,
  Send,
  Eye,
  AlertCircle
} from "lucide-react";
import { Button } from "../ui/button";

/* Mock Data */
const availableJobRequests = [
  {
    id: 101,
    title: "Fix leaking kitchen sink urgently",
    serviceType: "Plumbing",
    description:
      "Kitchen sink has a persistent leak under the basin. Need immediate repair.",
    client: "Ahmed Khan",
    clientRating: 4.8,
    location: "Gulberg, Lahore",
    distance: "2.3 km away",
    budget: "Rs. 3,000 - Rs. 5,000",
    postedAgo: "30 minutes ago",
    deadline: "ASAP",
    totalBids: 2,
    clientReviews: 12
  },
  {
    id: 102,
    title: "Water heater installation",
    serviceType: "Plumbing",
    description:
      "Need professional to install new water heater in bathroom. Old one needs removal.",
    client: "Fatima Malik",
    clientRating: 4.5,
    location: "Model Town, Lahore",
    distance: "4.1 km away",
    budget: "Rs. 8,000 - Rs. 12,000",
    postedAgo: "1 hour ago",
    deadline: "Within 2 days",
    totalBids: 1,
    clientReviews: 8
  }
];

export function MyBidsPage() {
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [bidAmount, setBidAmount] = useState("");
  const [availability, setAvailability] = useState("");
  const [completionTime, setCompletionTime] = useState("");
  const [bidMessage, setBidMessage] = useState("");

  const handleSubmitBid = (request) => {
    setSelectedRequest(request);
    setShowBidModal(true);
  };

  const submitBid = () => {
    console.log({
      request: selectedRequest,
      bidAmount,
      availability,
      completionTime,
      bidMessage
    });

    setShowBidModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">

        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Wrench className="text-white" />
            </div>
            <span className="font-bold text-xl">UtilitY</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <Link
            to="/provider-dashboard"
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-100"
          >
            <LayoutDashboard size={18} /> Home
          </Link>

          <Link
            to="/provider-messages"
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-100"
          >
            <MessageSquare size={18} /> Messages
          </Link>

          <Link
            to="/bids-history"
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-100"
          >
            <History size={18} /> Bids History
          </Link>

          <Link
            to="/my-bids"
            className="flex items-center gap-3 p-3 rounded bg-blue-100 font-semibold"
          >
            <ClipboardList size={18} /> Available Bids
          </Link>

          <Link
            to="/provider-profile"
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-100"
          >
            <User size={18} /> Profile
          </Link>

        </nav>

        <div className="p-4 border-t">
          <Link to="/login" className="flex items-center gap-3 text-red-600">
            <LogOut size={18} /> Logout
          </Link>
        </div>

      </aside>

      {/* Main */}
      <main className="flex-1 p-8">

        <h1 className="text-3xl font-bold mb-2">
          Available Job Requests
        </h1>

        <p className="text-gray-500 mb-6">
          Browse and bid on jobs posted by customers in your area
        </p>

        {/* Gradient Banner */}
        <div className="bg-gradient-to-r from-blue-400 to-teal-300 text-white p-6 rounded-xl flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold">New Job Opportunities</h2>
            <p className="text-sm">
              6 new requests in your area matching your skills
            </p>
          </div>

          <Button
            className="!bg-white !text-blue-600 border border-blue-200 hover:bg-blue-50"
            >
            Set Preferences
            </Button>



        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {availableJobRequests.map((request) => (

            <div
              key={request.id}
              className="bg-white p-6 rounded-2xl shadow border"
            >

              {/* Title */}
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-semibold">
                  {request.title}
                </h3>

                <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                  {request.postedAgo}
                </span>
              </div>

              <p className="text-gray-500 text-sm mb-3">
                {request.description}
              </p>

              {/* Service Tag */}
              <span className="inline-block bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full mb-4">
                {request.serviceType}
              </span>

              {/* Client Row */}
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg mb-4">

                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center font-bold">
                    {request.client[0]}
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {request.client}
                    </p>

                    <p className="text-xs text-gray-500">
                      {request.clientReviews} reviews
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} />
                  <span className="text-sm">
                    {request.clientRating}
                  </span>
                </div>

              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">

                <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                  <DollarSign size={16} className="text-green-600" />
                  {request.budget}
                </div>

                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <MapPin size={16} />
                  {request.location}
                </div>

                <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-lg">
                  <MapPin size={16} />
                  {request.distance}
                </div>

                <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg">
                  <Clock size={16} />
                  {request.deadline}
                </div>

              </div>

              {/* Bids Alert */}
              <div className="bg-yellow-50 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                <AlertCircle size={16} />
                {request.totalBids} bids submitted already
              </div>

              {/* Buttons */}
              <div className="flex gap-3">

                <Button
                  onClick={() => handleSubmitBid(request)}
                  className="flex-1 flex items-center gap-2"
                >
                  <Send size={16} />
                  Submit Bid
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 flex items-center gap-2"
                >
                  <Eye size={16} />
                  View Details
                </Button>

              </div>

            </div>

          ))}

        </div>

      </main>

      {showBidModal && selectedRequest && (

            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[650px] max-h-[90vh] overflow-y-auto rounded-2xl p-8">

            <h2 className="text-2xl font-bold mb-6">Submit Your Bid</h2>

            {/* Service Request Card */}

            <div className="bg-blue-100 p-6 rounded-2xl mb-6">

            <p className="text-sm text-gray-600 mb-1">Service Request</p>

            <h3 className="text-xl font-semibold mb-4">
            {selectedRequest.title}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">

            <div>
            <p className="text-gray-500">Client:</p>
            <p className="font-medium">{selectedRequest.client}</p>
            </div>

            <div>
            <p className="text-gray-500">Budget:</p>
            <p className="text-green-600 font-medium">
            {selectedRequest.budget}
            </p>
            </div>

            <div>
            <p className="text-gray-500">Location:</p>
            <p className="font-medium">{selectedRequest.location}</p>
            </div>

            <div>
            <p className="text-gray-500">Deadline:</p>
            <p className="font-medium">{selectedRequest.deadline}</p>
            </div>

            </div>

            </div>

            {/* Bid Amount */}

            <label className="block text-sm font-medium mb-1">
            Your Bid Amount (Rs.) *
            </label>

            <div className="flex items-center border rounded-xl px-3 mb-4">

            <span className="text-gray-400 mr-2">$</span>

            <input
            type="text"
            placeholder="e.g. Rs. 4,500"
            value={bidAmount}
            onChange={(e)=>setBidAmount(e.target.value)}
            className="w-full p-3 outline-none"
            />

            </div>

            {/* Availability */}

            <label className="block text-sm font-medium mb-1">
            Your Availability *
            </label>

            <div className="flex items-center border rounded-xl px-3 mb-4">

            <Clock size={18} className="text-gray-400 mr-2"/>

            <input
            type="text"
            placeholder="e.g. Tomorrow, 10 AM"
            value={availability}
            onChange={(e)=>setAvailability(e.target.value)}
            className="w-full p-3 outline-none"
            />

            </div>

            {/* Completion Time */}

            <label className="block text-sm font-medium mb-1">
            Expected Completion Time *
            </label>

            <div className="flex items-center border rounded-xl px-3 mb-4">

            <Clock size={18} className="text-gray-400 mr-2"/>

            <input
            type="text"
            placeholder="e.g. 3–4 hours"
            value={completionTime}
            onChange={(e)=>setCompletionTime(e.target.value)}
            className="w-full p-3 outline-none"
            />

            </div>

            {/* Message */}

            <label className="block text-sm font-medium mb-1">
            Message to Client (Optional)
            </label>

            <textarea
            placeholder="Introduce yourself and explain why you're the best fit for this job..."
            value={bidMessage}
            onChange={(e)=>setBidMessage(e.target.value)}
            className="w-full border rounded-xl p-3 h-28 mb-6 outline-none"
            />

            {/* Buttons */}

            <div className="flex gap-4">

            <Button
            onClick={submitBid}
            className="flex-1 bg-blue-400 hover:bg-blue-500 text-white"
            >
            Submit Bid
            </Button>

            <Button
            variant="outline"
            onClick={()=>setShowBidModal(false)}
            className="flex-1"
            >
            Cancel
            </Button>

            </div>

            </div>

            </div>

            )}


    </div>
  );
}
