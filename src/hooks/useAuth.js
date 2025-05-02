// src/hooks/useAuth.js
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../store/slice/authSlice";
import { logoutApi } from "../api/authService";

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi();
      console.log("Server logout successful");
    } catch (err) {
      // If it’s an unauthorized token, we still want to clear state
      if (err.response?.status === 401) {
        console.warn("Session already expired, forcing client logout");
      } else {
        console.error("Logout failed:", err);
      }
    } finally {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate]);

  return { handleLogout };
}
