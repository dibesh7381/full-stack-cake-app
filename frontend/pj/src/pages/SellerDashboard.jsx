import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SellerDashboard() {

  const [shop, setShop] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);

  /* ================= FETCH SHOP ================= */
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await api.get("/auth/seller/shop", {
          withCredentials: true
        });
        setShop(res.data.data);
        setForm(res.data.data);
      } catch {
        setShop(null);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, []);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SAVE ================= */
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setMessage(null);

      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify(form)], { type: "application/json" })
      );
      if (image) formData.append("image", image);

      const res = shop
        ? await api.put("/auth/seller/shop", formData, { withCredentials: true })
        : await api.post("/auth/seller/shop", formData, { withCredentials: true });

      setShop(res.data.data);
      setEditMode(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Operation failed"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  /* ================= PREMIUM PROFILE CARD ================= */
  if (shop && !editMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* HERO IMAGE */}
          <div className="relative">
            <img
              src={shop.shopImageUrl}
              alt="Shop"
              className="w-full h-48 object-cover"
            />

            {/* AVATAR */}
            <div className="absolute -bottom-10 left-6">
              <div className="w-40 h-40 rounded-xl border-4 border-white shadow-md overflow-hidden bg-white">
                <img
                  src={shop.shopImageUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="pt-14 px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="md:col-span-2 space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {shop.shopName}
              </h2>

              <p className="text-sm text-gray-600">
                👤 Owner: <span className="font-medium">{shop.ownerName}</span>
              </p>

              <p className="text-sm text-gray-500 leading-relaxed">
                📍 {shop.address}, {shop.city}, {shop.state} - {shop.pincode}
              </p>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex md:flex-col gap-3">
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition"
              >
                ✏️ Edit Shop
              </button>

              <button
                className="flex-1 border border-pink-600 text-pink-600 hover:bg-pink-50 py-3 rounded-xl font-semibold transition"
              >
                ➕ Add Cakes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= CREATE / EDIT FORM ================= */
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSave}
        className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          {shop ? "Edit Shop ✏️" : "Create Your Shop 🏪"}
        </h2>

        {message && (
          <div className="p-3 text-sm rounded-lg text-center bg-red-100 text-red-700">
            {message.text}
          </div>
        )}

        {["shopName", "ownerName", "city", "state", "pincode"].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.toUpperCase()}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
          />
        ))}

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          rows={3}
          placeholder="Full Address"
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="text-sm"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold"
          >
            💾 Save
          </button>

          {shop && (
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="flex-1 border py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}


