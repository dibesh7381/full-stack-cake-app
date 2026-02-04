/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, resetCart } from "../redux/slices/cartSlice";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  // ✅ LIVE cart count from Redux
  const cartCount = useSelector((state) => state.cart.items.length);

  // ================= ROLE DECODE =================
  let role = null;
  if (token) {
    try {
      role = jwtDecode(token).role;
    } catch {
      role = null;
    }
  }

  // 🔥 SYNC CART WITH AUTH STATE
  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    } else {
      dispatch(resetCart());
    }
  }, [token, dispatch]);

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    navigate("/login");
  };

  // ================= MY ORDERS NAVIGATION =================
  const handleMyOrders = () => {
    if (role === "SELLER") {
      navigate("/seller/orders");
    } else {
      navigate("/my-orders");
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* LOGO */}
          <h1
            className="text-xl font-extrabold cursor-pointer"
            onClick={() => navigate("/")}
          >
            🎂 CakeApp
          </h1>

          {/* ================= DESKTOP ================= */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/">Home</Link>

            {token && <Link to="/cakes">Cakes</Link>}

            {/* My Orders hidden for seller */}
            {token && role !== "SELLER" && (
              <button onClick={handleMyOrders}>
                My Orders
              </button>
            )}

            <Link to="/profile">Profile</Link>

            {role === "CUSTOMER" && (
              <Link to="/become-seller">Become Seller</Link>
            )}

            {role === "SELLER" && (
              <>
                <Link to="/seller/shop">My Shop</Link>
                <Link to="/seller/dashboard">Dashboard</Link>
                <Link to="/seller/orders">Seller Orders</Link>
              </>
            )}

            {/* 🛒 CART */}
            {token && (
              <Link to="/cart" className="relative flex items-center">
                <ShoppingCart size={28} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {token ? (
              <button onClick={logout}>Logout</button>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}
          </div>

          {/* ================= MOBILE ICONS ================= */}
          <div className="flex items-center gap-3 md:hidden">
            {token && (
              <Link to="/cart" className="relative mb-1">
                <ShoppingCart size={30} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <button onClick={() => setOpen(true)}>
              <Menu size={26} />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-60 bg-white z-50
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between p-4 border-b">
          <h2 className="font-bold text-purple-600">🎂 CakeApp</h2>
          <button onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-5 text-sm">
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          {token && (
            <Link to="/cakes" onClick={() => setOpen(false)}>
              Cakes
            </Link>
          )}

          {/* My Orders hidden for seller */}
          {token && role !== "SELLER" && (
            <button
              onClick={() => {
                setOpen(false);
                handleMyOrders();
              }}
              className="text-left"
            >
              My Orders
            </button>
          )}

          <Link to="/profile" onClick={() => setOpen(false)}>
            Profile
          </Link>

          {role === "CUSTOMER" && (
            <Link to="/become-seller" onClick={() => setOpen(false)}>
              Become Seller
            </Link>
          )}

          {role === "SELLER" && (
            <>
              <Link to="/seller/shop" onClick={() => setOpen(false)}>
                My Shop
              </Link>
              <Link to="/seller/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <Link to="/seller/orders" onClick={() => setOpen(false)}>
                Seller Orders
              </Link>
            </>
          )}

          {token ? (
            <button onClick={logout} className="text-left">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/signup" onClick={() => setOpen(false)}>
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
