// src/components/Sidebar.jsx

import React, { useMemo, useEffect, useState } from "react";
import "../styles/sidebar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import api from "../axiosInstance";

// Icons
import { IoLogoYoutube, IoHomeSharp } from "react-icons/io5";
import {
  MdOutlineSubscriptions,
  MdOutlineWatchLater,
  MdOutlineVideoLibrary,
  MdLogout,
} from "react-icons/md";
import { BiLike } from "react-icons/bi";
import { TbMusic } from "react-icons/tb";
import { PiFireLight } from "react-icons/pi";

const Sidebar = ({ sidebarOpen, setSidebarOpen, darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?._id;

  const [userChannel, setUserChannel] = useState(null);

  // --------------------------
  // FETCH USER CHANNEL (IF EXISTS)
  // --------------------------
  useEffect(() => {
    const fetchUserChannel = async () => {
      if (!userId) return; // No user → skip

      try {
        const res = await api.get(`/channels/find/${userId}`);
        setUserChannel(res.data); // User already created channel
      } catch (err) {
        setUserChannel(null); // User has no channel yet
      }
    };

    fetchUserChannel();
  }, [userId]);

  // --------------------------
  // SET ACTIVE TAB BASED ON PATH
  // --------------------------
  const activeTab = useMemo(() => {
    switch (location.pathname) {
      case "/":
        return "Home";
      case "/trending":
        return "Trending";
      case "/subscriptions":
        return "Subscriptions";
      case "/your-videos":
        return "YourVideos";
      case "/watchlater":
        return "WatchLater";
      case "/liked":
        return "Liked";
      case "/music":
        return "Music";
      default:
        return "";
    }
  }, [location.pathname]);

  // --------------------------
  // LOGOUT USER
  // --------------------------
  const logOut = () => {
    localStorage.removeItem("currentUser");
    dispatch(logout());
    navigate("/signin");
  };

  // --------------------------
  // NAVIGATION HELPER
  // --------------------------
  const goToPage = (page, path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`sidebar-container ${sidebarOpen ? "open" : ""} ${
          darkMode ? "dark" : ""
        }`}
      >
        {/* -------- LOGO -------- */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo-section">
            <IoLogoYoutube size={30} color="red" />
            <span className="sidebar-logo-text">YouTube</span>
          </Link>
        </div>

        {/* -------- MAIN SECTIONS -------- */}
        <div className="sidebar-section">
          <div
            className={`sidebar-item ${activeTab === "Home" ? "active" : ""}`}
            onClick={() => goToPage("Home", "/")}
          >
            <IoHomeSharp /> Home
          </div>

          <div
            className={`sidebar-item ${
              activeTab === "Trending" ? "active" : ""
            }`}
            onClick={() => goToPage("Trending", "/trending")}
          >
            <PiFireLight /> Shorts
          </div>

          <div
            className={`sidebar-item ${
              activeTab === "Subscriptions" ? "active" : ""
            }`}
            onClick={() => goToPage("Subscriptions", "/subscriptions")}
          >
            <MdOutlineSubscriptions /> Subscriptions
          </div>

          <hr />
          <p className="sidebar-section-title">You</p>

          <div
            className={`sidebar-item ${
              activeTab === "YourVideos" ? "active" : ""
            }`}
            onClick={() => goToPage("YourVideos", "/your-videos")}
          >
            <MdOutlineVideoLibrary /> Your Videos
          </div>

          {/* If user HAS a channel, show "Your Channel" */}
          {currentUser && userChannel && (
            <div
              className="sidebar-item"
              onClick={() => navigate(`/channel/${userChannel._id}`)}
            >
              <MdOutlineVideoLibrary /> Your Channel
            </div>
          )}

          {/* If user DOES NOT have channel, show Create Channel */}
          {currentUser && !userChannel && (
            <div
              className="sidebar-item create-channel-btn"
              onClick={() => navigate("/channel/create")}
            >
              + Create Channel
            </div>
          )}

          <div
            className={`sidebar-item ${
              activeTab === "WatchLater" ? "active" : ""
            }`}
            onClick={() => goToPage("WatchLater", "/watchlater")}
          >
            <MdOutlineWatchLater /> Watch Later
          </div>

          <div
            className={`sidebar-item ${activeTab === "Liked" ? "active" : ""}`}
            onClick={() => goToPage("Liked", "/liked")}
          >
            <BiLike /> Liked Videos
          </div>

          <hr />

          <div
            className={`sidebar-item ${activeTab === "Music" ? "active" : ""}`}
            onClick={() => goToPage("Music", "/music")}
          >
            <TbMusic /> Music
          </div>

          <hr />

          {/* SIGN OUT / SIGN IN */}
          {currentUser ? (
            <div className="sidebar-item" onClick={logOut}>
              <MdLogout /> Sign Out
            </div>
          ) : (
            <div className="sidebar-login-box">
              <p>Sign in to like videos, comment & subscribe</p>
              <button
                onClick={() => navigate("/signin")}
                className="signin-btn"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* -------- FOOTER -------- */}
        <div className="sidebar-footer">
          <a
            href="https://github.com/KhushbuKumari21"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
