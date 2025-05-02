import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { updateToken } from "../store/slice/authSlice";
import { API_ENDPOINTS } from "../api/endpoints";
import { baseAxios } from "../api/axiosBase";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { accesstoken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const [authenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await baseAxios.post(
          API_ENDPOINTS.AUTH + "/api/auth/refresh"
        );

        console.log(response.data);
        dispatch(updateToken({ accesstoken: response.data.accessToken }));
      } catch (error) {
        console.error("Token refresh failed", error?.response || error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setAuthenticating(false);
        console.log("interval running");
      }
    };

    // Trigger token refresh and websocket connect only if token is null
    if (accesstoken === null) {
      refreshAccessToken();
    } else {
      setAuthenticating(false);
    }

    const intervalId = setInterval(
      refreshAccessToken,
      import.meta.env.VITE_REFRESH_TOKEN_INTERVAL_TIME
    );

    // 🧹 Cleanup on unmount: disconnect WebSocket and clear interval
    return () => {
      clearInterval(intervalId);
    };
  }, [accesstoken, dispatch, handleLogout, navigate]);

  if (authenticating) {
    return <div>Loading...</div>;
  }

  return accesstoken ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
