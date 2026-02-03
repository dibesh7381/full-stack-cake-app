/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

export default function SellerDashboard() {
  const token = localStorage.getItem("token");

  const [cakes, setCakes] = useState([]);
  const [editingCakeId, setEditingCakeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const FLAVOURS = [
    "Chocolate",
    "Vanilla",
    "Strawberry",
    "Butterscotch",
    "Black Forest",
  ];

  const [form, setForm] = useState({
    cakeName: "",
    cakeFlavour: "",
    cakeWeight: "",
    cakePrice: "",
  });

  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null); // 🔥 for clearing file input

  // ================= LOAD MY CAKES =================
  const loadCakes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cakes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCakes(res.data.data);
    } catch {
      console.log("Failed to load cakes");
    }
  };

  useEffect(() => {
    loadCakes();
  }, []);

  // auto hide message
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 2000);
      return () => clearTimeout(t);
    }
  }, [message]);

  // ================= HANDLE FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      cakeName: "",
      cakeFlavour: "",
      cakeWeight: "",
      cakePrice: "",
    });
    setImage(null);
    setEditingCakeId(null);

    // 🔥 clear file input properly
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ================= ADD / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append("image", image);

      if (editingCakeId) {
        await axios.put(`${BASE_URL}/cakes/${editingCakeId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Cake updated successfully 🎂");
      } else {
        await axios.post(`${BASE_URL}/cakes`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Cake added successfully 🎉");
      }

      resetForm();
      loadCakes();
    } catch {
      setMessage("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (cake) => {
    setForm({
      cakeName: cake.cakeName,
      cakeFlavour: cake.cakeFlavour,
      cakeWeight: cake.cakeWeight,
      cakePrice: cake.cakePrice,
    });
    setEditingCakeId(cake.id);

    // clear old file selection when entering edit
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImage(null);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this cake?")) return;

    try {
      await axios.delete(`${BASE_URL}/cakes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Cake deleted ❌");
      loadCakes();
    } catch {
      setMessage("Delete failed");
    }
  };

  return (
    <div className="pt-20 px-4 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Seller Dashboard 🍰
          </h1>
          <p className="text-gray-500 mt-1">
            Add, update and manage your cakes
          </p>
        </div>

        {/* MESSAGE */}
        <div className="h-12 flex justify-center mb-6">
          {message && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm">
              {message}
            </div>
          )}
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <input
            name="cakeName"
            placeholder="Cake Name"
            value={form.cakeName}
            onChange={handleChange}
            required
            className="border rounded-xl px-4 py-3"
          />

          <select
            name="cakeFlavour"
            value={form.cakeFlavour}
            onChange={handleChange}
            required
            className="border rounded-xl px-4 py-3 bg-white"
          >
            <option value="">Select Flavour</option>
            {FLAVOURS.map((flavour) => (
              <option key={flavour} value={flavour}>
                {flavour}
              </option>
            ))}
          </select>

          <input
            name="cakeWeight"
            placeholder="Weight (kg)"
            value={form.cakeWeight}
            onChange={handleChange}
            required
            className="border rounded-xl px-4 py-3"
          />

          <input
            name="cakePrice"
            placeholder="Price (₹)"
            value={form.cakePrice}
            onChange={handleChange}
            required
            className="border rounded-xl px-4 py-3"
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => setImage(e.target.files[0])}
            className="col-span-full"
          />

          <div className="col-span-full flex gap-4">
            <button
              disabled={loading}
              className={`flex-1 bg-gradient-to-r from-indigo-600 to-pink-600
              text-white py-3 rounded-xl font-semibold
              ${loading ? "opacity-70" : "hover:opacity-90"}`}
            >
              {loading
                ? "Processing..."
                : editingCakeId
                ? "Update Cake"
                : "Add Cake"}
            </button>

            {editingCakeId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 border rounded-xl py-3"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* CAKES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cakes.map((cake) => (
            <div
              key={cake.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <img
                src={cake.cakeImageUrl}
                alt="cake"
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{cake.cakeName}</h3>
                <p className="text-sm text-gray-600">
                  {cake.cakeFlavour} • {cake.cakeWeight}kg
                </p>
                <p className="font-semibold mt-1">₹ {cake.cakePrice}</p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(cake)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cake.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cakes.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No cakes added yet 🍰
          </p>
        )}
      </div>
    </div>
  );
}

