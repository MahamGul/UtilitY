import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./pages/loginpage";

import CustomerLayout from "./pages/customerlayout";
import CustomerDashboard from "./pages/customerdashboard";
import { CustomerProfilePage } from "./pages/customer-profile";

import ProviderDashboard from "./pages/provider_dashboard";
import { BidsHistoryPage } from "./pages/bids_history";
import ProviderProfilePage from "./pages/provider_profile";


export default function App() {
  return (
    <Router>
      <Routes>

        {/* Home page */}
        <Route path="/" element={<HomePage />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Customer area */}
        <Route path="/customer-dashboard" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="profile" element={<CustomerProfilePage />} />
        </Route>

        {/* Provider area */}
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/provider-profile" element={<ProviderProfilePage />} />
        <Route path="/bids-history" element={<BidsHistoryPage />} />
        {/* Fallback (ALWAYS LAST) */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}