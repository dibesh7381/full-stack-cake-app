import { useEffect, useRef, useState } from "react";
import api from "../api/axios";

export default function SellerCakes() {

  const fileRef = useRef(null); // 🔥 file input ref

  const [cakes, setCakes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    cakeType: "",
    flavour: "",
    weightKg: "",
    price: ""
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);

  /* ================= FETCH SELLER CAKES ================= */
  const fetchCakes = async () => {
    const res = await api.get("/auth/seller/cakes", {
      withCredentials: true
    });
    setCakes(res.data.data);
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setForm({
      cakeType: "",
      flavour: "",
      weightKg: "",
      price: ""
    });
    setImage(null);
    setEditingId(null);

    // 🔥 clear file input
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  /* ================= ADD / UPDATE CAKE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId && !image) {
      setMessage({ type: "error", text: "Cake image is required" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify(form)], { type: "application/json" })
      );
      if (image) formData.append("image", image);

      if (editingId) {
        await api.put(`/auth/seller/cakes/${editingId}`, formData, {
          withCredentials: true
        });
      } else {
        await api.post("/auth/seller/cakes", formData, {
          withCredentials: true
        });
      }

      await fetchCakes();
      resetForm();

    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Operation failed"
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (cake) => {
    setEditingId(cake.id);
    setForm({
      cakeType: cake.cakeType,
      flavour: cake.flavour,
      weightKg: cake.weightKg,
      price: cake.price
    });
    setImage(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (cakeId) => {
    if (!confirm("Delete this cake?")) return;

    await api.delete(`/auth/seller/cakes/${cakeId}`, {
      withCredentials: true
    });

    fetchCakes();
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">

      {/* ================= ADD / EDIT FORM ================= */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6 mb-10">
        <h2 className="text-xl font-bold text-center mb-4">
          {editingId ? "Edit Cake ✏️" : "Add New Cake 🍰"}
        </h2>

        {message && (
          <div className="mb-4 p-3 text-sm rounded-lg text-center bg-red-100 text-red-700">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* CAKE TYPE */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Cake Type
            </label>
            <select
              name="cakeType"
              value={form.cakeType}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-lg"
            >
              <option value="">Select Cake Type</option>
              <option>Birthday</option>
              <option>Wedding</option>
              <option>Anniversary</option>
              <option>Custom</option>
            </select>
          </div>

          {/* FLAVOUR */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Flavour
            </label>
            <select
              name="flavour"
              value={form.flavour}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-lg"
            >
              <option value="">Select Flavour</option>
              <option>Chocolate</option>
              <option>Vanilla</option>
              <option>Butterscotch</option>
              <option>Strawberry</option>
            </select>
          </div>

          {/* WEIGHT + PRICE */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Weight (kg)
              </label>
              <input
                name="weightKg"
                type="number"
                step="0.5"
                value={form.weightKg}
                onChange={handleChange}
                required
                placeholder="e.g. 1"
                className="w-full mt-1 p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Price (₹)
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="e.g. 799"
                className="w-full mt-1 p-3 border rounded-lg"
              />
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Cake Image
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full mt-1 text-sm"
            />
          </div>

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Saving..." : editingId ? "Update Cake" : "Add Cake"}
          </button>
        </form>
      </div>

      {/* ================= CAKES LIST ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {cakes.map((cake) => (
          <div
            key={cake.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <img
              src={cake.imageUrl}
              alt="Cake"
              className="w-full h-80 object-cover"
            />

            <div className="p-4 space-y-1">
              <h3 className="font-bold text-lg">
                {cake.cakeType} Cake
              </h3>

              <p className="text-sm text-gray-600">
                {cake.flavour} • {cake.weightKg}kg
              </p>

              <p className="font-semibold text-pink-600">
                ₹{cake.price}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(cake)}
                  className="flex-1 border py-2 rounded-lg text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cake.id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

