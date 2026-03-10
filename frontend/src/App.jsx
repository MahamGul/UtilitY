// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./pages/loginpage";
// import CustomerLayout from "./pages/customerlayout";
// import CustomerDashboard from "./pages/customerdashboard";
// import { CustomerProfilePage } from "./pages/customer-profile";

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Login */}
//         <Route path="/login" element={<LoginPage />} />

//         {/* Customer area wrapped in layout */}
//         <Route path="/customer-dashboard" element={<CustomerLayout />}>
//           <Route index element={<CustomerDashboard />} />             {/* /customer-dashboard */}
//           <Route path="profile" element={<CustomerProfilePage />} /> {/* /customer-dashboard/profile */}
//           {/* add more nested pages like post-request, active-requests */}
//         </Route>

//         {/* Catch-all */}
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// }



import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./pages/loginpage";
import CustomerLayout from "./pages/customerlayout";
import CustomerDashboard from "./pages/customerdashboard";
import { CustomerProfilePage } from "./pages/customer-profile";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<HomePage />} />

        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />

        {/* Customer area */}
        <Route path="/customer-dashboard" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="profile" element={<CustomerProfilePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}