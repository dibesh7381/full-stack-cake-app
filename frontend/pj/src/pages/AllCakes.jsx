import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AllCakes() {

  const [cakes, setCakes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 8;

  /* ================= FETCH CAKES + PROFILE ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cakesRes, profileRes] = await Promise.all([
          api.get(
            `/auth/cakes/paged?page=${page}&size=${PAGE_SIZE}`,
            { withCredentials: true }
          ),
          api.get("/auth/profile", { withCredentials: true })
        ]);

        const pageData = cakesRes.data.data;

        setCakes(pageData.content);
        setTotalPages(pageData.totalPages);
        setCurrentUser(profileRes.data.data);

      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page]);

  /* ================= ACTIONS ================= */
  const handleAddToCart = (cake) => {
    alert("Added to cart 🛒");
    console.log("Add to cart:", cake);
  };

  const handleBuyNow = (cake) => {
    alert("Redirect to checkout 💳");
    console.log("Buy now:", cake);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading cakes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">

      <h1 className="text-3xl font-extrabold text-center mb-8">
        🎂 All Cakes
      </h1>

      {/* ================= CAKE GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

        {cakes.map((cake) => {

          const isOwnCake =
            currentUser?.role === "SELLER" &&
            String(currentUser?.id) === String(cake.sellerId);

          return (
            <div
              key={cake.cakeId}
              className="bg-white rounded-2xl shadow-lg overflow-hidden relative"
            >

              {/* 🔥 YOUR CAKE BADGE */}
              {isOwnCake && (
                <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  Your Cake
                </span>
              )}

              <img
                src={cake.imageUrl}
                alt="Cake"
                className="w-full h-56 object-cover"
              />

              <div className="p-4 space-y-1">
                <h3 className="text-lg font-bold">
                  {cake.cakeType} Cake
                </h3>

                <p className="text-sm text-gray-600">
                  {cake.flavour} • {cake.weightKg}kg
                </p>

                <p className="text-sm text-gray-500">
                  🏪 {cake.shopName} ({cake.city})
                </p>

                <p className="text-xl font-extrabold text-pink-600 mt-1">
                  ₹{cake.price}
                </p>

                <div className="flex gap-2 mt-4">

                  <button
                    disabled={isOwnCake}
                    onClick={() => handleAddToCart(cake)}
                    className={`flex-1 py-2 rounded-lg font-semibold
                      ${
                        isOwnCake
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "border border-pink-600 text-pink-600 hover:bg-pink-50"
                      }`}
                  >
                    Add to Cart
                  </button>

                  <button
                    disabled={isOwnCake}
                    onClick={() => handleBuyNow(cake)}
                    className={`flex-1 py-2 rounded-lg font-semibold
                      ${
                        isOwnCake
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-pink-600 hover:bg-pink-700 text-white"
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

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center items-center gap-2 mt-10">

        <button
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-4 py-2 rounded
              ${page === i ? "bg-pink-600 text-white" : "bg-white border"}
            `}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages - 1}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
}
