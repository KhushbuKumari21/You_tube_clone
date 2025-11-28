import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Header";
import HomePage from "./pages/HomePage";
import VideoPage from "./pages/VideoPage";
import SignIn from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Search from "./pages/SearchPage";
import Account from "./pages/Acoount";
import UploadPage from "./pages/UploadPage";

import CreateChannel from "./pages/CreateChannel";
import ChannelPage from "./pages/ChannelPage";        
import UploadVideo from "./pages/UploadPage";  
import EditVideo from "./pages/EditVideo";
     

import PageNotFound from "./pages/PageNotFound";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/App.css";

const AppWrapper = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="container">

        {/* Sidebar */}
        <Sidebar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="main">

          {/* Navbar */}
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setSidebarOpen={setSidebarOpen}
          />

          {/* ROUTES */}
          <div className="wrapper">
            <Routes>

              {/* PROTECTED ROUTES */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage type="random" />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/trending"
                element={
                  <ProtectedRoute>
                    <HomePage type="trend" />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/subscriptions"
                element={
                  <ProtectedRoute>
                    <HomePage type="sub" />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/video/:id"
                element={
                  <ProtectedRoute>
                    <VideoPage />
                  </ProtectedRoute>
                }
              />

              {/* Upload (General) */}
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                }
              />

              {/* Account Page */}
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account currentUser={currentUser} />
                  </ProtectedRoute>
                }
              />

              {/* ----------------------------- */}
              {/* ⭐ CHANNEL & VIDEO MANAGEMENT */}
              {/* ----------------------------- */}

              <Route
                path="/create-channel"
                element={
                  <ProtectedRoute>
                    <CreateChannel />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/channel/:id"
                element={
                  <ProtectedRoute>
                    <ChannelPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/upload-video/:channelId"
                element={
                  <ProtectedRoute>
                    <UploadVideo />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit-video/:videoId"
                element={
                  <ProtectedRoute>
                    <EditVideo />
                  </ProtectedRoute>
                }
              />

              {/* PUBLIC ROUTES */}
              <Route path="/signin" element={<SignIn setSidebarOpen={setSidebarOpen} />} />
              <Route path="/signup" element={<RegisterPage setSidebarOpen={setSidebarOpen} />} />
              <Route path="/search" element={<Search />} />

              {/* 404 PAGE */}
              <Route path="*" element={<PageNotFound />} />

            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default AppWrapper;
