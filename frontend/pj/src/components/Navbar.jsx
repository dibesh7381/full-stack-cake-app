import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role; // CUSTOMER | SELLER

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  // 🔥 prevent UI flicker
  if (loading) return null;

  return (
    <>
      {/* ================= TOP NAV ================= */}
      <nav className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link
              to="/"
              className="text-2xl font-extrabold text-pink-600"
              onClick={() => setOpen(false)}
            >
              CakeApp 🍰
            </Link>

            {/* MOBILE MENU ICON */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setOpen(true)}
            >
              <Menu size={28} />
            </button>

            {/* ================= DESKTOP MENU ================= */}
            <div className="hidden md:flex items-center space-x-6">

              <Link to="/" className="hover:text-pink-600">
                Home
              </Link>

              {/* 🔥 ALL CAKES (EVERYONE) */}
              <Link to="/cakes" className="hover:text-pink-600 font-semibold">
                All Cakes
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="hover:text-pink-600">
                    Profile
                  </Link>

                  {/* CUSTOMER */}
                  {role === "CUSTOMER" && (
                    <Link
                      to="/become-seller"
                      className="hover:text-pink-600 font-semibold"
                    >
                      Become Seller
                    </Link>
                  )}

                  {/* SELLER */}
                  {role === "SELLER" && (
                    <>
                      <Link
                        to="/seller/dashboard"
                        className="hover:text-pink-600 font-semibold"
                      >
                        Dashboard
                      </Link>

                      <Link
                        to="/seller/cakes"
                        className="hover:text-pink-600 font-semibold"
                      >
                        My Cakes
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-pink-600">
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-bold text-pink-600">Menu</span>
          <button onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* LINKS */}
        <div className="p-4 space-y-4 text-lg">

          <Link to="/" onClick={() => setOpen(false)} className="block">
            Home
          </Link>

          {/* 🔥 ALL CAKES */}
          <Link
            to="/cakes"
            onClick={() => setOpen(false)}
            className="block font-semibold text-pink-600"
          >
            All Cakes
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="block"
              >
                Profile
              </Link>

              {/* CUSTOMER */}
              {role === "CUSTOMER" && (
                <Link
                  to="/become-seller"
                  onClick={() => setOpen(false)}
                  className="block font-semibold text-pink-600"
                >
                  Become Seller
                </Link>
              )}

              {/* SELLER */}
              {role === "SELLER" && (
                <>
                  <Link
                    to="/seller/dashboard"
                    onClick={() => setOpen(false)}
                    className="block font-semibold text-pink-600"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/seller/cakes"
                    onClick={() => setOpen(false)}
                    className="block font-semibold text-pink-600"
                  >
                    My Cakes
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="w-full mt-6 bg-pink-500 text-white py-3 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="block bg-pink-500 text-white text-center py-2 rounded-lg"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}


