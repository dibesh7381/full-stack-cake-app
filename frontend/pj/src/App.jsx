import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import BecomeSeller from "./pages/BecomeSeller";
import SellerDashboard from "./pages/SellerDashboard";
import SellerCakes from "./pages/SellerCakes"; // 🔥 ADD THIS
import AllCakes from "./pages/AllCakes";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      {/* navbar height offset */}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/cakes" element={<SellerCakes />} />
          <Route path="/cakes" element={<AllCakes />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}



