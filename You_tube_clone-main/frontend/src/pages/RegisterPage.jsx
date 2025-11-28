// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance"; // Axios instance for API requests
import "../styles/auth.css"; // Styles for authentication forms
import { toast, ToastContainer } from "react-toastify"; // Notifications
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage({ setSidebarOpen }) {
  const navigate = useNavigate(); // React Router navigation hook

  // --- State to hold form input values ---
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // --- State to hold validation errors ---
  const [errors, setErrors] = useState({});

  // --- Close sidebar when user navigates to register page ---
  const closeSidebar = () => {
    if (setSidebarOpen) setSidebarOpen(false);
  };

  // --- Update form state on input change ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- Form validation logic ---
  const validateForm = () => {
    const newErrors = {};

    // Validate username (required)
    if (!form.username.trim()) newErrors.username = "Username is required";

    // Validate email (required)
    if (!form.email.trim()) newErrors.email = "Email is required";

    // Validate password
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    else if (!/[A-Z]/.test(form.password))
      newErrors.password = "Password must contain an uppercase letter";
    else if (!/[0-9]/.test(form.password))
      newErrors.password = "Password must contain a number";

    // Validate confirm password
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  // --- Handle form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate form before sending request
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors); // Display validation errors
      return;
    }

    try {
      // --- API call to register user ---
      await axiosInstance.post("/auth/signup", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      closeSidebar();

      // --- Show success toast and redirect to login ---
      toast.success("Account created! Redirecting to login...", {
        autoClose: 2000,
        onClose: () => navigate("/signin"),
      });
    } catch (err) {
      console.error(err);
      closeSidebar();

      // --- Handle "user already registered" error ---
      if (
        err.response?.status === 400 &&
        err.response?.data?.message === "User already registered"
      ) {
        toast.info("Email already registered! Redirecting to login...", {
          autoClose: 2000,
          onClose: () => navigate("/signin"),
        });
      } else {
        // --- Handle other registration errors ---
        toast.error(err.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="auth-container">
      {/* Toast notifications container */}
      <ToastContainer />

      {/* Registration Form */}
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {/* Username Field */}
        <label>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter your username"
        />
        {errors.username && <p className="error-msg">{errors.username}</p>}

        {/* Email Field */}
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        {errors.email && <p className="error-msg">{errors.email}</p>}

        {/* Password Field */}
        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
        {errors.password && <p className="error-msg">{errors.password}</p>}

        {/* Confirm Password Field */}
        <label>Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="error-msg">{errors.confirmPassword}</p>
        )}

        {/* Submit Button */}
        <button type="submit" className="auth-btn">
          Register
        </button>
      </form>
    </div>
  );
}
