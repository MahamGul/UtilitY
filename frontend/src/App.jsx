import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./pages/loginpage";
import ProviderDashboard from "./pages/provider_dashboard";

function App() {
  return (
    <Router>
      <Routes>

        {/* Homepage */}
        <Route path="/" element={<HomePage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Provider Dashboard */}
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;