/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/seller/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.data);
      setError("");
    } catch (err) {
      console.error("Error fetching seller orders", err);
      setError("Failed to load seller orders");
    } finally {
      setLoading(false);
    }
  };

  // ================= CANCEL ORDER =================
  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${BASE_URL}/seller/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // refresh list
      fetchSellerOrders();
    } catch (err) {
      console.error("Cancel error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "Failed to cancel order"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Seller Orders
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">
          Loading orders...
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-center text-red-500">
          {error}
        </p>
      )}

      {/* NO ORDERS */}
      {!loading && orders.length === 0 && (
        <p className="text-center text-gray-500">
          No orders yet.
        </p>
      )}

      {/* ORDERS GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white shadow rounded-xl p-4"
          >
            <img
              src={order.cakeImageUrl}
              alt={order.cakeName}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />

            <h2 className="text-lg font-semibold">
              {order.cakeName}
            </h2>

            <p className="text-sm text-gray-600">
              Customer: {order.customerName}
            </p>

            <p className="text-sm text-gray-600">
              Email: {order.customerEmail}
            </p>

            <div className="mt-2 text-sm">
              <p>Price: ₹{order.cakePrice}</p>
              <p>Quantity: {order.quantity}</p>
              <p className="font-semibold">
                Total: ₹{order.totalAmount}
              </p>
            </div>

            {/* STATUS + ACTION */}
            <div className="mt-3 flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.orderStatus === "CONFIRMED"
                    ? "bg-green-100 text-green-700"
                    : order.orderStatus === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.orderStatus}
              </span>

              {order.orderStatus !== "CANCELLED" && (
                <button
                  onClick={() => cancelOrder(order.orderId)}
                  className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
