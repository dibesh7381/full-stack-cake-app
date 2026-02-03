/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

export default function CreateShop() {
  const [form, setForm] = useState({
    shopName: "",
    shopPhone: "",
    shopAddress: "",
  });

  const [image, setImage] = useState(null);
  const [shop, setShop] = useState(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false); // 🔥 NEW

  const token = localStorage.getItem("token");

  const loadMyShop = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/shop`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShop(res.data.data);
    } catch {
      console.log("No shop found");
    }
  };

  useEffect(() => {
    loadMyShop();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true); // 🔥 start loader

    try {
      const formData = new FormData();
      formData.append("shopName", form.shopName);
      formData.append("shopPhone", form.shopPhone);
      formData.append("shopAddress", form.shopAddress);
      if (image) formData.append("image", image);

      const res = editing
        ? await axios.put(`${BASE_URL}/shop`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.post(`${BASE_URL}/shop`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });

      setMessageType("success");
      setMessage(res.data.message);
      setShop(res.data.data);
      resetForm();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // 🔥 stop loader
    }
  };

  const handleEdit = () => {
    setForm({
      shopName: shop.shopName,
      shopPhone: shop.shopPhone,
      shopAddress: shop.shopAddress,
    });
    setEditing(true);
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setEditing(false);
    setForm({ shopName: "", shopPhone: "", shopAddress: "" });
    setImage(null);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your shop?")) return;

    try {
      const res = await axios.delete(`${BASE_URL}/shop`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessageType("success");
      setMessage(res.data.message);
      setShop(null);
    } catch {
      setMessageType("error");
      setMessage("Failed to delete shop");
    }
  };

  return (
    <div className="pt-20 px-4 min-h-screen flex justify-center">
      <div className="w-full max-w-2xl">
        {/* HEADER */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">
            {editing ? "Update Your Shop ✏️" : "Create Your Shop 🏪"}
          </h2>
          <p className="text-gray-500 mt-1">
            Manage your seller shop details and image
          </p>
        </div>

        {/* MESSAGE AREA */}
        <div className="h-12 flex items-center justify-center mb-4">
          {message && (
            <div
              className={`px-4 py-2 rounded-lg text-sm font-medium
              ${
                messageType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* FORM */}
        {(!shop || editing) && (
          <form className="bg-white rounded-2xl shadow-xl p-6 space-y-5">
            <input
              type="text"
              name="shopName"
              placeholder="Shop Name"
              value={form.shopName}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500"
              required
            />

            <input
              type="text"
              name="shopPhone"
              placeholder="Shop Phone"
              value={form.shopPhone}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500"
              required
            />

            <textarea
              name="shopAddress"
              placeholder="Shop Address"
              value={form.shopAddress}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500"
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="text-sm"
            />

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2
                  bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                  text-white font-semibold py-3 rounded-xl transition
                  ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
              >
                {loading && (
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {editing ? "Update Shop" : "Create Shop"}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl
                             hover:bg-gray-100 transition disabled:opacity-60"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* SHOP CARD */}
        {shop && !editing && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
            <img
              src={shop.shopImageUrl}
              alt="shop"
              className="w-full h-56 object-cover"
            />

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {shop.shopName}
              </h3>
              <p className="text-gray-600 mt-2">📞 {shop.shopPhone}</p>
              <p className="text-gray-600">📍 {shop.shopAddress}</p>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleEdit}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


