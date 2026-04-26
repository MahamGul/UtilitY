import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ServiceProviderVerification from './pages/ServiceProviderVerification';
import CustomerReports from './pages/CustomerReports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/providers" element={<ServiceProviderVerification />} />
        <Route path="/reports" element={<CustomerReports />} />
      </Routes>
    </Router>
  );
}

export default App;
