import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setProfile(res.data.data));
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
          My Profile 👤
        </h2>

        {/* Profile Card */}
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-purple-50 rounded-xl px-4 py-3">
            <span className="text-sm font-medium text-gray-500">Username</span>
            <span className="font-semibold text-gray-800">
              {profile?.username}
            </span>
          </div>

          <div className="flex items-center justify-between bg-purple-50 rounded-xl px-4 py-3">
            <span className="text-sm font-medium text-gray-500">Email</span>
            <span className="font-semibold text-gray-800">
              {profile?.email}
            </span>
          </div>

          <div className="flex items-center justify-between bg-purple-50 rounded-xl px-4 py-3">
            <span className="text-sm font-medium text-gray-500">Role</span>
            <span className="font-semibold text-purple-600 uppercase tracking-wide">
              {profile?.role}
            </span>
          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-xs text-center text-gray-500">
          This information is securely fetched using JWT authentication.
        </p>
      </div>
    </div>
  );
}
