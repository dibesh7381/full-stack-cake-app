import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BecomeSeller() {

  const { upgradeToSeller } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleBecomeSeller = async () => {
    try {
      setLoading(true);
      setMessage("");

      // ✅ USE CONTEXT (not direct api)
      await upgradeToSeller();

      setMessage("🎉 You are now a SELLER!");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setMessage(
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 text-center">

        <h2 className="text-2xl font-bold mb-3">
          Become a Seller 🍰
        </h2>

        <p className="text-gray-600 mb-6">
          Start selling your delicious cakes and grow your business with us.
        </p>

        <button
          onClick={handleBecomeSeller}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition
            ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"}
          `}
        >
          {loading ? "Upgrading..." : "Become a Seller"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-green-600 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

