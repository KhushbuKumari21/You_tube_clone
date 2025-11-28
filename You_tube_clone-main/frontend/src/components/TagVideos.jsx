// src/components/TagVideos.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Tags from "./Tags";
import { DEFAULT_TAGS } from "../constants";
import "../styles/tagVideos.css";

const TagVideos = () => {
  const [activeTag, setActiveTag] = useState("All");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let url = "http://localhost:5000/api/videos";
        if (activeTag !== "All") {
          url += `/tag/${activeTag}`;
        }
        const res = await axios.get(url);
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };

    fetchVideos();
  }, [activeTag]);

  return (
    <div>
      {/* Tag Selector */}
      <Tags
        tags={DEFAULT_TAGS}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
      />

      {/* Videos List */}
      <div className="videos-list">
        {videos.map((video) => (
          <div key={video._id} className="video-card">
            <h3>{video.title}</h3>
            <video src={video.videoUrl} controls width="400" />
            <p>Channel: {video.channel?.channelName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagVideos;
