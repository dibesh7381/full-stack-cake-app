/* eslint-disable react-hooks/error-boundaries */
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function CustomerRoute({ children }) {
  try {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    if (decoded.role === "CUSTOMER") {
      return children;
    }

    return <Navigate to="/profile" replace />;
  } catch {
    return <Navigate to="/" replace />;
  }
}
