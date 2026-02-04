/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, addToCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8080/api/auth";

export default function AllCakes() {
  const [cakes, setCakes] = useState([]);
  const [loadingCakeId, setLoadingCakeId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ cart items from Redux
  const cartItems = useSelector((state) => state.cart.items);
  const cartCakeIds = new Set(cartItems.map((item) => item.cakeId));

  const token = localStorage.getItem("token");

  let currentUserId = null;
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);

      // 🔥 safe userId extraction
      currentUserId =
        decoded.sub || decoded.id || decoded.userId || null;

      role = decoded.role;
    } catch (err) {
      console.log(err);
    }
  }

  // ================= LOAD ALL CAKES =================
  const loadAllCakes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cakes/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCakes(res.data.data || []);
    } catch {
      console.log("Failed to load cakes");
    }
  };

  useEffect(() => {
    loadAllCakes();
    dispatch(fetchCart()); // 🔥 sync cart once
  }, [dispatch]);

  // ================= ADD TO CART =================
  const handleAddToCart = async (cakeId) => {
    try {
      setLoadingCakeId(cakeId);
      await dispatch(addToCart(cakeId));
    } catch {
      alert("❌ Failed to add to cart");
    } finally {
      setLoadingCakeId(null);
    }
  };

  // ================= BUY NOW =================
  const handleBuyNow = (cakeId) => {
    navigate("/checkout", {
      state: {
        cakeId: cakeId,
        quantity: 1,
      },
    });
  };

  return (
    <div className="pt-20 px-4 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Explore Cakes 🎂
          </h1>
          <p className="text-gray-500 mt-1">
            Order delicious cakes from top sellers
          </p>
        </div>

        {/* CAKES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cakes.map((cake) => {
            const isOwnCake =
              role === "SELLER" &&
              String(cake.sellerId) === String(currentUserId);

            const isInCart = cartCakeIds.has(cake.id);

            // disable logic
            const isAddDisabled =
              isOwnCake || isInCart || loadingCakeId === cake.id;

            const isBuyDisabled = isOwnCake;

            return (
              <div
                key={cake.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden relative
                ${isOwnCake ? "ring-2 ring-purple-500" : ""}`}
              >
                {isOwnCake && (
                  <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                    Your Cake
                  </span>
                )}

                <img
                  src={cake.cakeImageUrl}
                  alt={cake.cakeName}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800">
                    {cake.cakeName}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    {cake.cakeFlavour} • {cake.cakeWeight}kg
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    🏪 {cake.shopName}
                  </p>

                  <p className="text-sm text-gray-500">
                    📞 {cake.shopPhone}
                  </p>

                  <p className="text-xl font-extrabold text-gray-800 mt-2">
                    ₹ {cake.cakePrice}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      disabled={isAddDisabled}
                      onClick={() => handleAddToCart(cake.id)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                      ${
                        isAddDisabled
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {isInCart
                        ? "Added ✔"
                        : loadingCakeId === cake.id
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>

                    <button
                      disabled={isBuyDisabled}
                      onClick={() => handleBuyNow(cake.id)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold
                      ${
                        isBuyDisabled
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-pink-600 text-white hover:bg-pink-700"
                      }`}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {cakes.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No cakes available right now 🍰
          </p>
        )}
      </div>
    </div>
  );
}
