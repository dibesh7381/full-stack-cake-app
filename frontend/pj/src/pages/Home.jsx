import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Home() {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await api.get("/auth/homepage");
        setHome(res.data.data);
      } catch  {
        console.error("Failed to load home page");
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
          {home.title}
        </h1>

        {/* Content */}
        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
          {home.content}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/signup"
            className="px-6 py-3 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
          >
            Get Started
          </a>

          
        </div>
      </div>
    </div>
  );
}
