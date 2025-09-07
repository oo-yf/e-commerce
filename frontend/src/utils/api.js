import axios from "axios";
import { getToken, clearAuth } from "../utils/authStorage";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token on every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global 401 handler: clear auth and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearAuth();
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

// --- Cart API ---
export const fetchUserCart = async () => {
  const { data } = await api.get("/cart");
  return data.items || data || [];
};

export const saveUserCart = async (cartItems) => {
  const { data } = await api.post("/cart", { cartItems });
  return data.items || data || [];
};

export default api;