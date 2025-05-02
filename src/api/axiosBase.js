import axios from "axios";

export const baseAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // ✅ Allow cross-origin credentials
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token dynamically before every request
baseAxios.interceptors.request.use(
  (config) => {
    let accesstoken = sessionStorage.getItem("accesstoken");

    if (accesstoken) {
      config.headers.Authorization = `Bearer ${accesstoken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
