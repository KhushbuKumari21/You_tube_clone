import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
  const { currentUser } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [avatarLetter, setAvatarLetter] = useState("U");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    // 1. Prefer Redux state
    let user = currentUser;

    // 2. Fallback to localStorage
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) user = JSON.parse(storedUser);
    }

    if (user) {
      setAvatarLetter(
        (user.username?.[0] || user.email?.[0] || "U").toUpperCase()
      );
    } else {
      setAvatarLetter("U");
    }
  }, [currentUser]);

  const handleSignIn = () => navigate("/signin");

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <div className="navbar-container">
      {/* LEFT */}
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

      {/* CENTER */}
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

      {/* RIGHT */}
      <div className="navbar-right">
        <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
        </button>

        {!currentUser && !localStorage.getItem("user") ? (
          <button className="signin-btn" onClick={handleSignIn}>
            <MdOutlineAccountCircle /> Sign In
          </button>
        ) : (
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
