// D:\youtube-clone\frontend\src\pages\RegisterPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "../styles/auth.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage({ setSidebarOpen }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const closeSidebar = () => {
    if (setSidebarOpen) setSidebarOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) newErrors.username = "Username is required";

    if (!form.email.trim()) newErrors.email = "Email is required";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    else if (!/[A-Z]/.test(form.password))
      newErrors.password = "Password must contain an uppercase letter";
    else if (!/[0-9]/.test(form.password))
      newErrors.password = "Password must contain a number";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axiosInstance.post("/auth/signup", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      closeSidebar();

      toast.success("Account created! Redirecting to login...", {
        autoClose: 2000,
        onClose: () => navigate("/signin"),
      });
    } catch (err) {
      console.error(err);
      closeSidebar();

      if (
        err.response?.status === 400 &&
        err.response?.data?.message === "User already registered"
      ) {
        toast.info("Email already registered! Redirecting to login...", {
          autoClose: 2000,
          onClose: () => navigate("/signin"),
        });
      } else {
        toast.error(err.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />

      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter your username"
        />
        {errors.username && <p className="error-msg">{errors.username}</p>}

        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        {errors.email && <p className="error-msg">{errors.email}</p>}

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
        {errors.password && <p className="error-msg">{errors.password}</p>}

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

        <button type="submit" className="auth-btn">
          Register
        </button>
      </form>
    </div>
  );
}
