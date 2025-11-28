import React from "react";
import { Link } from "react-router-dom";
import "../styles/pageNotFound.css";

const PageNotFound = () => {
  return (
    <div className="pnf-container">
      <div className="pnf-wrapper">
        <img
          className="pnf-image"
          src="https://cdn1.iconfinder.com/data/icons/photo-stickers-words/128/word_18-1024.png"
          alt="Page Not Found"
        />

        <Link to="/" className="pnf-title">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
