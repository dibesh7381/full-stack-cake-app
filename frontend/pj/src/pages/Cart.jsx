/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateQuantity,
  removeCartItem,
  clearCart,
} from "../redux/slices/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: cart } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = cart.reduce(
    (sum, item) => sum + item.cakePrice * item.quantity,
    0,
  );

  // 🛑 EMPTY CART
  if (cart.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4 text-center bg-gray-50">
        <p className="text-2xl font-bold text-gray-600">
          🛒 Your cart is empty
        </p>
        <p className="text-sm text-gray-400">
          Looks like you haven’t added any cakes yet 🍰
        </p>
        <button
          onClick={() => navigate("/cakes")}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full shadow-lg"
        >
          Buy Cakes 🍰
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 pb-48">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-center text-gray-800 mb-6">
          Your Cart
        </h1>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.cakeId}
              className="bg-white rounded-2xl shadow-sm border p-4 lg:p-6 flex gap-4 lg:gap-6"
            >
              {/* IMAGE */}
              <img
                src={item.cakeImageUrl}
                alt={item.cakeName}
                className="w-20 h-20 lg:w-28 lg:h-28 rounded-xl object-cover"
              />

              {/* INFO */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-sm lg:text-lg text-gray-800">
                    {item.cakeName}
                  </h2>
                  <button
                    onClick={() => dispatch(removeCartItem(item.cakeId))}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="text-xs lg:text-sm text-gray-500 mt-0.5">
                  ₹ {item.cakePrice} each
                </p>

                <div className="flex items-center justify-between mt-4">
                  {/* QTY */}
                  <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-1.5">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            cakeId: item.cakeId,
                            quantity: -1,
                          }),
                        )
                      }
                    >
                      <Minus size={16} />
                    </button>

                    <span className="font-semibold text-sm lg:text-base">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            cakeId: item.cakeId,
                            quantity: 1,
                          }),
                        )
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* PRICE */}
                  <p className="font-extrabold text-sm lg:text-lg">
                    ₹ {item.cakePrice * item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 FOOTER / BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-xl lg:text-2xl font-extrabold">₹ {total}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => dispatch(clearCart())}
              className="
    px-4 py-2 text-sm 
    lg:px-8 lg:py-3 lg:text-base lg:min-w-[140px]
    border border-red-300 text-red-500 
    rounded-lg hover:bg-red-50 transition
  "
            >
              Clear
            </button>

            <button
              onClick={() => navigate("/checkout")}
              className="px-6 lg:px-10 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl text-sm lg:text-base"
            >
              Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
