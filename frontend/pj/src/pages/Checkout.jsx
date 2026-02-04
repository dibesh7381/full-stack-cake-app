/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "http://localhost:8080/api/auth";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Buy Now se data aayega
  const { cakeId, quantity } = location.state || {};

  const [form, setForm] = useState({
    houseNo: "",
    colony: "",
    landmark: "",
    pincode: "",
    mobileNumber: "",
    paymentMethod: "COD",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        cakeId,
        quantity,
        ...form,
      };

      await axios.post(`${BASE_URL}/order`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Order placed successfully 🎉");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Order failed");
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-3xl mx-auto py-8">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-800">
              Checkout 🧾
            </h2>
            <p className="text-gray-500 mt-1">
              Fill your delivery details to place the order
            </p>
          </div>

          {/* Address Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Delivery Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="houseNo"
                placeholder="House / Building No"
                value={form.houseNo}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <input
                type="text"
                name="colony"
                placeholder="Colony / Area"
                value={form.colony}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <input
                type="text"
                name="landmark"
                placeholder="Landmark"
                value={form.landmark}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 md:col-span-2"
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={form.mobileNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Payment Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Payment Method
            </h3>

            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="UPI">UPI</option>
              <option value="BANK">Bank Transfer</option>
            </select>
          </div>

          {/* Button */}
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
