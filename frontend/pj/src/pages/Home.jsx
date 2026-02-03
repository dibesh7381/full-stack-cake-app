import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/homepage")
      .then((res) => setData(res.data.data));
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 md:p-12">
        <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold text-purple-600 bg-purple-100 rounded-full">
          🎂 Welcome
        </span>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
          {data?.title}
        </h1>

        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
          {data?.content}
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {token ? (
            <>
              <Link
                to="/profile"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow hover:opacity-90 transition"
              >
                Go to Profile
              </Link>

              <Link
                to="/"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="px-6 py-3 rounded-xl border border-red-500 text-red-500 font-semibold hover:bg-red-50 transition"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow hover:opacity-90 transition"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="px-6 py-3 rounded-xl border border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
