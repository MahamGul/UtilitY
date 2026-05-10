import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

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
    path.startsWith("/customer") || path === "/customer-dashboard";

  // Show provider chatbot
  const isProviderPage = path.startsWith("/provider") || path.includes("bids");

  return (
    <>
      {isCustomerPage && <CustomerChatbot />}
      {isProviderPage && <ProviderChatbot />}
    </>
  );
}

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;

  return children;
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
        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute role="customer">
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute role="customer">
                <CustomerProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-requests"
            element={
              <ProtectedRoute role="customer">
                <ActiveRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="post-request"
            element={
              <ProtectedRoute role="customer">
                <PostRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="history"
            element={
              <ProtectedRoute role="customer">
                <ServiceHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="messages"
            element={
              <ProtectedRoute role="customer">
                <CustomerMessages />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Customer offers */}
        <Route
          path="/customer-available-offers"
          element={<CustomerAvailableOffers />}
        />

        {/* Provider area */}
        <Route
          path="/provider-dashboard"
          element={
            <ProtectedRoute role="provider">
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider-profile"
          element={
            <ProtectedRoute role="provider">
              <ProviderProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bids-history"
          element={
            <ProtectedRoute role="provider">
              <BidsHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bids"
          element={
            <ProtectedRoute role="provider">
              <MyBidsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider-messages"
          element={
            <ProtectedRoute role="provider">
              <ProviderMessages />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* ✅ GLOBAL CHATBOT CONTROL */}
      <ChatbotController />
    </Router>
  );
}
