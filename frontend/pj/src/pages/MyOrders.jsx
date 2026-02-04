/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const token = localStorage.getItem("token");

  const loadOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data.data || []);
      console.log(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ================= CANCEL ORDER =================
  const handleCancel = async (orderId) => {
    try {
      setLoadingId(orderId);

      await axios.delete(`${BASE_URL}/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // refresh orders
      loadOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 px-4">
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
          My Orders 📦
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">
            You have not placed any orders yet.
          </p>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const isCancelled = order.orderStatus === "CANCELLED";

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row gap-5 items-center justify-between"
                >
                  {/* LEFT: IMAGE + DETAILS */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={order.cakeImageUrl}
                      alt={order.cakeName}
                      className="w-24 h-24 object-cover rounded-xl"
                    />

                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {order.cakeName}
                      </h3>

                      <p className="text-sm text-gray-500">
                        🏪 {order.shopName}
                      </p>

                      <p className="text-sm text-gray-500">
                        ₹ {order.cakePrice} × {order.quantity}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT: TOTAL + STATUS + BUTTON */}
                  <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                    <p className="text-xl font-bold text-gray-800">
                      ₹ {order.totalAmount}
                    </p>

                    {/* STATUS BADGE */}
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full
                        ${
                          isCancelled
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {order.orderStatus}
                    </span>

                    {/* CANCEL BUTTON */}
                    {!isCancelled && (
                      <button
                        onClick={() => handleCancel(order.orderId)}
                        disabled={loadingId === order.orderId}
                        className={`text-sm px-4 py-2 rounded-lg transition
                          ${
                            loadingId === order.orderId
                              ? "bg-gray-300 text-gray-500"
                              : "bg-red-500 text-white hover:bg-red-600"
                          }`}
                      >
                        {loadingId === order.orderId
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
