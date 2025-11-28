// src/axiosInstance.js
import axios from "axios";
import { store } from "./redux/store";
import { logout } from "./redux/userSlice";
import { toast } from "react-toastify";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
  timeout: 10000,
});

// REQUEST INTERCEPTOR → attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user?.currentUser?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR → handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      store.dispatch(logout());
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    } else if (status === 400) {
      toast.error(message || "Bad request");
    } else if (status === 403) {
      toast.error("You do not have permission to perform this action.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
