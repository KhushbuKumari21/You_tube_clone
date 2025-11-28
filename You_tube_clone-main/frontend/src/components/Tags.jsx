// src/components/Tags.jsx
import React from "react";
import "../styles/tags.css"; // make sure to add the updated CSS
import { DEFAULT_TAGS } from "../constants";

const Tags = ({ tags = DEFAULT_TAGS, darkMode, activeTag, setActiveTag }) => {
  if (!Array.isArray(tags)) return null;

  return (
    <div className="tags-container">
      {tags.map((tag, index) => {
        const tagName =
          typeof tag === "string" ? tag : tag?.name || `tag-${index}`;
        return (
          <span
            key={index}
            className={`tag-item ${activeTag === tagName ? "active" : ""} ${
              darkMode ? "dark" : "light"
            }`}
            onClick={() => setActiveTag(tagName)}
          >
            {tagName}
          </span>
        );
      })}
    </div>
  );
};

export default Tags;
