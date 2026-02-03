/* eslint-disable react-hooks/error-boundaries */
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function SellerRoute({ children }) {
  try {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    if (decoded.role === "SELLER") {
      return children;
    }

    return <Navigate to="/login" replace />;
  } catch  {
    return <Navigate to="/" replace />;
  }
}
