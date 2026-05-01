import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Public pages
import HomePage from "./HomePage";
import LoginPage from "./pages/loginpage";
import SignupPage from "./pages/SignUp";

// Customer pages
import CustomerLayout from "./pages/customerlayout";
import CustomerDashboard from "./pages/customerdashboard";
import { CustomerProfilePage } from "./pages/customer-profile";
import { ActiveRequestsPage } from "./pages/myrequest";
import { PostRequestPage } from "./pages/postrequest";
import ServiceHistoryPage from "./pages/servicehistory";
import { CustomerAvailableOffers } from "./pages/customeravailableoffers";
import CustomerMessages from "./pages/customermessages";

// Provider pages
import ProviderDashboard from "./pages/provider_dashboard";
import ProviderProfilePage from "./pages/provider_profile";
import { BidsHistoryPage } from "./pages/bids_history";
import { MyBidsPage } from "./pages/my_bids";
import ProviderMessages from "./pages/provider_messages";

// Chatbots
import CustomerChatbot from "./pages/customerchatbot";
import ProviderChatbot from "./pages/providerchatbot";


// ---------------- CHATBOT CONTROLLER ----------------
function ChatbotController() {
  const location = useLocation();

  const path = location.pathname;

  // Show customer chatbot
  const isCustomerPage =
    path.startsWith("/customer") ||
    path === "/customer-dashboard";

  // Show provider chatbot
  const isProviderPage =
    path.startsWith("/provider") ||  path.includes("bids");

  return (
    <>
      {isCustomerPage && <CustomerChatbot />}
      {isProviderPage && <ProviderChatbot />}
    </>
  );
}


// ---------------- MAIN APP ----------------
export default function App() {
  return (
    <Router>

      <Routes>

        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Customer area */}
        <Route path="/customer-dashboard" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="my-requests" element={<ActiveRequestsPage />} />
          <Route path="post-request" element={<PostRequestPage />} />
          <Route path="history" element={<ServiceHistoryPage />} />
          <Route path="messages" element={<CustomerMessages />} />
        </Route>

        {/* Customer offers */}
        <Route
          path="/customer-available-offers"
          element={<CustomerAvailableOffers />}
        />

        {/* Provider area */}
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/provider-profile" element={<ProviderProfilePage />} />
        <Route path="/bids-history" element={<BidsHistoryPage />} />
        <Route path="/my-bids" element={<MyBidsPage />} />
        <Route path="/provider-messages" element={<ProviderMessages />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

      {/* ✅ GLOBAL CHATBOT CONTROL */}
      <ChatbotController />

    </Router>
  );
}