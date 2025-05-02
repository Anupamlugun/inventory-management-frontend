// src/api/authService.js
import { baseAxios } from "./axiosBase";
import { API_ENDPOINTS } from "./endpoints";

export const logoutApi = () => {
  return baseAxios.post(`${API_ENDPOINTS.AUTH}/api/auth/logout`);
};
