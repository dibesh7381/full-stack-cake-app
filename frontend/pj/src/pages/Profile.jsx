import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        setProfile(res.data.data);
      } catch  {
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          My Profile 👤
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Name</label>
          <div className="mt-1 p-3 border rounded-lg bg-gray-50">
            {profile.name}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Email</label>
          <div className="mt-1 p-3 border rounded-lg bg-gray-50">
            {profile.email}
          </div>
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="text-sm text-gray-500">Role</label>
          <div className="mt-1 p-3 border rounded-lg bg-gray-50">
            {profile.role}
          </div>
        </div>

        {/* Info */}
        <p className="text-xs text-center text-gray-400">
          This information is fetched securely using JWT cookies.
        </p>
      </div>
    </div>
  );
}
