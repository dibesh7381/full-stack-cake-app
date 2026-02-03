import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import BecomeSeller from "./pages/BecomeSeller";
import CreateShop from "./pages/CreateShop";
import SellerDashboard from "./pages/SellerDashboard";
import AllCakes from "./pages/AllCakes";
import Cart from "./pages/Cart"; // 🛒 CART PAGE

import PrivateRoute from "./routes/PrivateRoute";
import CustomerRoute from "./routes/CustomerRoute";
import SellerRoute from "./routes/SellerRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* 🌍 PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔐 any logged-in user */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* 🌍 ALL CAKES (LOGGED-IN USERS ONLY) */}
        <Route
          path="/cakes"
          element={
            <PrivateRoute>
              <AllCakes />
            </PrivateRoute>
          }
        />

        {/* 🛒 CART (LOGGED-IN USERS ONLY) */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

        {/* 👤 CUSTOMER only */}
        <Route
          path="/become-seller"
          element={
            <PrivateRoute>
              <CustomerRoute>
                <BecomeSeller />
              </CustomerRoute>
            </PrivateRoute>
          }
        />

        {/* 🧑‍🍳 SELLER - shop */}
        <Route
          path="/seller/shop"
          element={
            <PrivateRoute>
              <SellerRoute>
                <CreateShop />
              </SellerRoute>
            </PrivateRoute>
          }
        />

        {/* 🧑‍🍳 SELLER - cakes dashboard */}
        <Route
          path="/seller/dashboard"
          element={
            <PrivateRoute>
              <SellerRoute>
                <SellerDashboard />
              </SellerRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
