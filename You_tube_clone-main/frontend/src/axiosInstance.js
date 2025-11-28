// src/axiosInstance.js
import axios from "axios";
import { store } from "./redux/store";
import { logout } from "./redux/userSlice";
import { toast } from "react-toastify";

// ------------------------------
// Create Axios instance
// ------------------------------
// This instance will be used for all API calls to the backend.
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL for backend API
  timeout: 10000, // Set a timeout of 10 seconds for requests
});

// ------------------------------
// REQUEST INTERCEPTOR
// ------------------------------
// Automatically attaches the JWT token from Redux store to every request.
// This ensures authenticated endpoints always receive the token.
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user?.currentUser?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------
// RESPONSE INTERCEPTOR
// ------------------------------
// Handles errors globally for all responses
axiosInstance.interceptors.response.use(
  (response) => response, // Return response if successful
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      // Unauthorized → logout user and redirect to login
      store.dispatch(logout());
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    } else if (status === 400) {
      // Bad request → show message from backend or default
      toast.error(message || "Bad request");
    } else if (status === 403) {
      // Forbidden → user not allowed
      toast.error("You do not have permission to perform this action.");
    } else if (status >= 500) {
      // Server error → notify user
      toast.error("Server error. Please try again later.");
    } else {
      // Other errors → generic message
      toast.error(message);
    }

    return Promise.reject(error); // Forward error for further handling if needed
  }
);

export default axiosInstance;
