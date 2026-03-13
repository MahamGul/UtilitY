import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./pages/loginpage";

import CustomerLayout from "./pages/customerlayout";
import CustomerDashboard from "./pages/customerdashboard";
import { CustomerProfilePage } from "./pages/customer-profile";
import { ActiveRequestsPage } from "./pages/myrequest";
import { PostRequestPage } from "./pages/postrequest"; // ✅ import PostRequestPage

import ProviderDashboard from "./pages/provider_dashboard";
import { BidsHistoryPage } from "./pages/bids_history";
import ProviderProfilePage from "./pages/provider_profile";
import { MyBidsPage } from "./pages/my_bids";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Customer area */}
        <Route path="/customer-dashboard" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="my-requests" element={<ActiveRequestsPage />} /> {/* My Requests page */}
          <Route path="post-request" element={<PostRequestPage />} /> {/* ✅ Post Request page */}
        </Route>

        {/* Provider area */}
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/provider-profile" element={<ProviderProfilePage />} />
        <Route path="/bids-history" element={<BidsHistoryPage />} />
        <Route path="/my-bids" element={<MyBidsPage />} />  

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}