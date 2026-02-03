import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BecomeSeller() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const becomeSeller = async () => {
    try {
      setLoading(true);
      setIsError(false);

      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:8080/api/auth/become-seller",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ replace token with NEW token
      localStorage.setItem("token", res.data.data.token);

      setMessage(res.data.data.message || "You are now a Seller 🎉");

      // redirect after short delay
      setTimeout(() => {
        navigate("/profile");
      }, 800);

    } catch (err) {
      setIsError(true);
      setMessage(
        err.response?.data?.message || "Unable to become seller"
      );
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 2000);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Become a Seller 🚀
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          Start selling your delicious cakes and reach more customers.
        </p>

        {/* MESSAGE AREA (fixed space) */}
        <div className="h-6 mb-4">
          {message && (
            <p
              className={`text-sm font-medium ${
                isError ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        <div className="bg-purple-50 rounded-xl p-4 mb-6 text-left text-sm text-gray-600">
          <ul className="space-y-2">
            <li>✔ Sell your own cakes</li>
            <li>✔ Manage your products</li>
            <li>✔ Access seller dashboard</li>
          </ul>
        </div>

        <button
          onClick={becomeSeller}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white shadow transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
            }
          `}
        >
          {loading ? "Upgrading..." : "Become Seller"}
        </button>
      </div>
    </div>
  );
}
