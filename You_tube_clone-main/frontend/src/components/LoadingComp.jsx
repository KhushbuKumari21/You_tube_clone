// src/components/LoadingComp.jsx

// This component shows a loading spinner.
// It accepts a prop "fullScreen" to decide whether to show a full-screen loader.
import React from "react";
import "../styles/loading.css"; // CSS for spinner and responsive design

const LoadingComp = ({ fullScreen = false }) => {
  return (
    // Apply fullscreen class only if prop is true
    <div className={`loading-container ${fullScreen ? "fullscreen" : ""}`}>
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingComp;
