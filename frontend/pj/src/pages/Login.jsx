import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const showMessage = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => setMessage(null), 2000);
  };

  const submit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        form
      );

      showMessage(res.data.message || "Login successful 🎉");
      localStorage.setItem("token", res.data.data.token);

      setTimeout(() => navigate("/profile"), 800);
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Invalid email or password",
        true
      );
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-white to-pink-50 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Login to continue to CakeApp
        </p>

        {/* MESSAGE PLACE (permanent space) */}
        <div className="h-6 text-center mb-4">
          {message && (
            <p
              className={`text-sm font-medium ${
                isError ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <input
            placeholder="Email"
            className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          onClick={submit}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow hover:opacity-90 transition"
        >
          Login
        </button>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

