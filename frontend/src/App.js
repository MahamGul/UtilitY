import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Homepage is now the default route */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;