// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";
import axiosInstance from "../axiosInstance";
import { fetchAllSuccess } from "../redux/videosSlice";
import "../styles/home.css";

// ---------- TAGS ----------
// Default tags for filtering videos by category
const DEFAULT_TAGS = [
  "All",
  "Music",
  "Gaming",
  "Programming",
  "Tech",
  "Sports",
  "News",
  "Comedy",
  "Movies",
  "React",
  "Movie",
];

// ---------- SAMPLE DATA ----------
// Fallback sample data to display if API fetch fails or returns empty
const sampleData = [
  {
    videoId: "video01",
    title: "Learn React in 30 Minutes",
    thumbnailUrl: "https://example.com/thumbnails/react30min.png",
    description: "A quick tutorial to get started with React.",
    channelId: "channel01",
    channelName: "Code Academy",
    uploader: "user01",
    views: 15200,
    likes: 1023,
    dislikes: 45,
    uploadDate: "2024-09-20",
    comments: [
      {
        commentId: "comment01",
        userId: "user02",
        text: "Great video! Very helpful.",
        timestamp: "2024-09-21T08:30:00Z",
      },
    ],
  },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { allVideos } = useSelector((state) => state.videos);
  const { currentUser } = useSelector((state) => state.user);

  // ---------- STATE ----------
  const [activeTag, setActiveTag] = useState("All"); // currently selected tag
  const [tags] = useState(DEFAULT_TAGS); // tag list for filtering
  const [loading, setLoading] = useState(true); // loading indicator
  const [err, setErr] = useState(""); // error message state

  // ---------- LOGIN CHECK ----------
  // If user is not logged in, show a message
  if (!currentUser) {
    return (
      <div className="home-container">
        <h2>Please Login to Continue</h2>
      </div>
    );
  }

  // ---------- FETCH VIDEOS ----------
  // Fetch all videos from API on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/videos");
        const videosArray = Array.isArray(res.data) ? res.data : [res.data];

        if (videosArray.length === 0) {
          // If API returns empty, fallback to sample data
          dispatch(fetchAllSuccess(sampleData));
        } else {
          // Otherwise, store fetched videos in Redux store
          dispatch(fetchAllSuccess(videosArray));
        }
      } catch (error) {
        console.error("Error fetching:", error);
        setErr("Failed to fetch videos."); // show error to user
        dispatch(fetchAllSuccess(sampleData)); // fallback to sample data
      } finally {
        setLoading(false); // stop loading indicator
      }
    };

    fetchVideos();
  }, [dispatch]);

  // ---------- FILTER & HIDE INVALID CHANNELS ----------
  // Only display videos with valid channelName
  const filteredVideos = allVideos
    .filter((v) => v.channelName || v.channel?.channelName) // hide unknown channels
    .filter((v) => activeTag === "All" || v.tags?.includes(activeTag)); // filter by selected tag

  return (
    <div className="home-container">
      {/* FILTER BUTTONS */}
      {/* Display tags as buttons to filter videos */}
      <div className="filter-buttons">
        {tags.map((tag) => (
          <button
            key={tag}
            className={activeTag === tag ? "active-filter" : ""}
            onClick={() => setActiveTag(tag)} // update active tag on click
          >
            {tag}
          </button>
        ))}
      </div>

      {/* LOADING / ERROR */}
      {loading && <p className="loading">Loading videos…</p>}
      {!loading && err && <p className="error">{err}</p>}

      {/* VIDEOS GRID */}
      <div className="videos-container">
        {!loading && filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard key={video.videoId || video._id} video={video} />
          ))
        ) : (
          !loading && <p>No videos found.</p> // show message if no videos
        )}
      </div>
    </div>
  );
};

export default HomePage;
