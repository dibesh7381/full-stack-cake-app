/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= CHECK AUTH ================= */
  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/profile", {
        withCredentials: true
      });

      setUser(res.data.data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN ================= */
  const login = async (credentials) => {
    await api.post("/auth/login", credentials, {
      withCredentials: true
    });

    await checkAuth();
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
    setIsAuthenticated(false);
  };

  /* ================= SIGNUP ================= */
  const signup = async (data) => {
    const res = await api.post("/auth/signup", data);
    return res;
  };

  /* ================= UPGRADE TO SELLER ================= */
  const upgradeToSeller = async () => {
    await api.post("/auth/upgrade-to-seller", {}, {
      withCredentials: true
    });

    // 🔥 MOST IMPORTANT LINE
    await checkAuth(); // refresh user role
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        signup,
        logout,
        checkAuth,
        upgradeToSeller, // 🔥 expose
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);



