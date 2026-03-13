import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Star, MessageCircle } from "lucide-react";

const mockProviders = [
  {
    id: "1",
    name: "Provider 1",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.6,
    jobsCompleted: 124,
    priceOffer: 75,
    message:
      "I can complete this job within 2 hours. I have 5+ years of experience with similar repairs and bring all necessary tools."
  },
  {
    id: "2",
    name: "Provider 2",
    profileImage: "https://randomuser.me/api/portraits/men/33.jpg",
    rating: 4.7,
    jobsCompleted: 124,
    priceOffer: 90,
    message:
      "I can complete this job within 2 hours. I have 5+ years of experience with similar repairs and bring all necessary tools."
  },
  {
    id: "3",
    name: "Provider 3",
    profileImage: "https://randomuser.me/api/portraits/men/34.jpg",
    rating: 4.8,
    jobsCompleted: 124,
    priceOffer: 105,
    message:
      "I can complete this job within 2 hours. I have 5+ years of experience with similar repairs and bring all necessary tools."
  }
];

export function CustomerAvailableOffers() {
  const navigate = useNavigate();
  const [acceptedProvider, setAcceptedProvider] = useState(null);

  const handleAccept = (id) => {
    setAcceptedProvider(id);
    setTimeout(() => {
      navigate("/customer-dashboard");
    }, 1500);
  };

  const handleClose = () => {
    navigate(-1);
  };

  return createPortal(
    <div className="fixed inset-0 flex justify-center items-start z-50 pointer-events-none">
      
      {/* Modal card only, no background overlay */}
      <div className="pointer-events-auto relative mt-20 w-[700px] max-w-full rounded-2xl shadow-2xl bg-white p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Service Offers</h2>
            <p className="text-gray-500 text-sm">
              Plumbing Repair • {mockProviders.length} offers received
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Providers list */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {mockProviders.map((provider) => (
            <div
              key={provider.id}
              className={`border rounded-xl p-4 ${
                acceptedProvider === provider.id
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-3">
                  <img
                    src={provider.profileImage}
                    alt={provider.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{provider.name}</p>
                    <p className="text-sm text-gray-500">
                      <Star className="inline w-4 h-4 text-yellow-400 mr-1" />
                      {provider.rating} • {provider.jobsCompleted} jobs completed
                    </p>
                  </div>
                </div>
                <p className="font-bold text-blue-500 text-lg">${provider.priceOffer}</p>
              </div>

              <p className="text-gray-600 text-sm mb-4">{provider.message}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(provider.id)}
                  className={`flex-1 py-2 rounded-xl text-white ${
                    acceptedProvider === provider.id ? "bg-green-400" : "bg-blue-400"
                  } hover:bg-blue-500 transition`}
                  disabled={acceptedProvider !== null}
                >
                  {acceptedProvider === provider.id ? "Accepted!" : "Accept Offer"}
                </button>

                <button
                  onClick={() => navigate("/provider-profile")}
                  className="flex-1 py-2 border rounded-xl text-gray-700 hover:bg-gray-100 transition"
                >
                  View Profile
                </button>

                <button className="p-2 border rounded-xl text-gray-700 hover:bg-gray-100 transition">
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