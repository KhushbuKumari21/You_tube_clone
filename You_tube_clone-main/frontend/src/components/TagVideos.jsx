// Importing required libraries and components
import React, { useState, useEffect } from "react";
import axios from "axios";
import Tags from "./Tags";                  // Tag selection component
import { DEFAULT_TAGS } from "../constants"; // Default tags list
import "../styles/tagVideos.css";            // Styles

const TagVideos = () => {
  // Store currently selected tag
  const [activeTag, setActiveTag] = useState("All");

  // Store fetched videos
  const [videos, setVideos] = useState([]);

  // Runs every time activeTag changes
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Default API endpoint
        let url = "http://localhost:5000/api/videos";

        // If user selects any tag other than "All", modify API URL
        if (activeTag !== "All") {
          url += `/tag/${activeTag}`;
        }

        // Fetch data from backend
        const res = await axios.get(url);

        // Save fetched videos to state
        setVideos(res.data);
      } catch (err) {
        // Error handling
        console.error("Error fetching videos:", err);
      }
    };

    fetchVideos(); // Function call
  }, [activeTag]); // Dependency array → runs on change of activeTag

  return (
    <div>
      {/* Tag Selector Component */}
      <Tags
        tags={DEFAULT_TAGS}      // List of tags
        activeTag={activeTag}    // Highlight selected tag
        setActiveTag={setActiveTag} // Update selected tag
      />

      {/* Video List Section */}
      <div className="videos-list">
        {videos.map((video) => (
          <div key={video._id} className="video-card">
            {/* Video title */}
            <h3>{video.title}</h3>

            {/* Video player */}
            <video src={video.videoUrl} controls width="400" />

            {/* Channel Info */}
            <p>Channel: {video.channel?.channelName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagVideos;
