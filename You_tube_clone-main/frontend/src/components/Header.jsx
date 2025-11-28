// src/components/Header.jsx

// React + Router + Redux imports
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Icons
import {
  MdOutlineMenu,
  MdOutlineAccountCircle,
  MdOutlineSearch,
  MdDarkMode,
  MdLightMode,
} from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io5";

import "../styles/Header.css";

const Header = ({ darkMode, setDarkMode, setSidebarOpen }) => {
  const navigate = useNavigate();

  // Get logged-in user from Redux
  const { currentUser } = useSelector((state) => state.user);

  // Local states
  const [searchQuery, setSearchQuery] = useState("");
  const [avatarLetter, setAvatarLetter] = useState("U");

  // Apply dark mode to body
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  // Calculate avatar letter from username or email
  useEffect(() => {
    let user = currentUser;

    // Fallback to localStorage (for refresh persistence)
    if (!user) {
      const stored = localStorage.getItem("user");
      if (stored) user = JSON.parse(stored);
    }

    // Set avatar initial
    if (user) {
      setAvatarLetter(
        (user.username?.[0] || user.email?.[0] || "U").toUpperCase()
      );
    } else {
      setAvatarLetter("U"); // default letter
    }
  }, [currentUser]);

  // Navigate to Sign-in
  const handleSignIn = () => navigate("/signin");

  // Search functionality
  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="navbar-container">
      {/* LEFT SECTION – Menu + Logo */}
      <div className="navbar-left">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <MdOutlineMenu size={28} />
        </button>

        <Link to="/" className="logo">
          <IoLogoYoutube size={28} color="red" />
          <span className="logo-text">YouTube</span>
        </Link>
      </div>

      {/* CENTER – Search Bar + Mic */}
      <div className="navbar-center">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            <MdOutlineSearch size={20} />
          </button>
        </div>

        <button className="mic-btn">
          <FaMicrophone size={18} />
        </button>
      </div>

      {/* RIGHT – Dark Mode Toggle + User Login Avatar */}
      <div className="navbar-right">
        {/* Theme Toggle */}
        <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
        </button>

        {/* Show Sign-In button if no user */}
        {!currentUser && !localStorage.getItem("user") ? (
          <button className="signin-btn" onClick={handleSignIn}>
            <MdOutlineAccountCircle /> Sign In
          </button>
        ) : (
          // Display user avatar + username
          <div className="user-info">
            <div className="avatar-circle">{avatarLetter}</div>
            <span className="username-text">
              {currentUser?.username || currentUser?.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
