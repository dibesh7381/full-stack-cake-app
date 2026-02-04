import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import BecomeSeller from "./pages/BecomeSeller";
import CreateShop from "./pages/CreateShop";
import SellerDashboard from "./pages/SellerDashboard";
import SellerOrders from "./pages/SellerOrders"; // ← add this
import AllCakes from "./pages/AllCakes";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";

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

        {/* 🌍 ALL CAKES */}
        <Route
          path="/cakes"
          element={
            <PrivateRoute>
              <AllCakes />
            </PrivateRoute>
          }
        />

        {/* 🛒 CART */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

        {/* 🧾 CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />

        {/* 👤 MY ORDERS */}
        <Route
          path="/my-orders"
          element={
            <PrivateRoute>
              <MyOrders />
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

        {/* 🧑‍🍳 SELLER - dashboard */}
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

        {/* 🧑‍🍳 SELLER - orders */}
        <Route
          path="/seller/orders"
          element={
            <PrivateRoute>
              <SellerRoute>
                <SellerOrders />
              </SellerRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
