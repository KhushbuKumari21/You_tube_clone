import React, { useState } from "react";
import "../styles/auth.css";
import axiosInstance from "../axiosInstance";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // ------------------ VALIDATION ------------------
    if (!email || !password) {
      toast.error("Email and Password are required!", {
        position: "top-right",
        autoClose: 2000,
        transition: Slide,
      });
      return;
    }

    try {
      // ------------------ API CALL ------------------
      const res = await axiosInstance.post("/auth/signin", { email, password });

      // ------------------ SAVE TOKEN & USER ------------------
      const userData = {
        ...res.data.user,
        token: res.data.token, // attach token for future requests
      };

      // Save in localStorage for fallback
      localStorage.setItem("currentUser", JSON.stringify(userData));

      // Save in Redux
      dispatch(loginSuccess(userData));

      toast.success("Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 1500,
        transition: Slide,
        onClose: () => navigate("/"),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials!", {
        position: "top-right",
        autoClose: 2000,
        transition: Slide,
      });
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />

      <form className="google-card" onSubmit={handleLogin}>
        <h1 className="google-title">Sign in</h1>
        <p className="google-subtitle">to continue to YouTube</p>

        <input
          className="google-input"
          type="email"
          placeholder="Email or phone"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="google-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="google-btn" type="submit">
          SignIn
        </button>

        <p className="google-link">
          <Link to="/signup">Create account</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
