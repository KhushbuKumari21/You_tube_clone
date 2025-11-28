// src/components/LoadingComp.jsx
import React from "react";
import "../styles/loading.css"; // Import the updated responsive CSS

const LoadingComp = ({ fullScreen = false }) => {
  return (
    <div className={`loading-container ${fullScreen ? "fullscreen" : ""}`}>
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingComp;
