import React from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import "../styles/VideoCard.css";

import placeholder from "../assets/placeholder.png";
import channelPlaceholder from "../assets/channel-placeholder.png";

const VideoCard = ({ video }) => {
  if (!video) return null;

  const channelName =
    video.channelName || video.channel?.channelName || "Unknown Channel";

  // Ensure uploadDate is valid
  const uploadTime = video.uploadDate
    ? format(new Date(video.uploadDate))
    : "Unknown time";

  return (
    <Link to={`/video/${video.videoId || video._id}`} className="video-link">
      <div className="video-card-container">
        {/* Thumbnail */}
        <img
          className="video-img"
          src={video.thumbnailUrl || placeholder}
          alt={video.title || "Video thumbnail"}
        />

        {/* Details */}
        <div className="details">
          <img
            className="channel-img"
            src={video.channel?.avatar || channelPlaceholder}
            alt={`${channelName} profile`}
          />

          <div className="texts">
            <h1 className="title">{video.title || "Untitled Video"}</h1>
            <h2 className="channel-name">{channelName}</h2>
            <div className="info">
              {(video.views || 0).toLocaleString()} views • {uploadTime}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
