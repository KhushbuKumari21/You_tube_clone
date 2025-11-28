import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance"; // Axios instance with baseURL
import VideoCard from "../components/VideoCard";
import LoadingComp from "../components/LoadingComp";
import Tags from "../components/Tags";
import { DEFAULT_TAGS } from "../constants";
import "../styles/search.css";

const SearchPage = () => {
  // State for storing all videos fetched by search query
  const [videos, setVideos] = useState([]);
  // State for storing filtered videos based on selected tag/category
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [tags] = useState(DEFAULT_TAGS); // Tags for filtering videos
  const [activeTag, setActiveTag] = useState("All"); // Currently selected tag
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error message state

  const location = useLocation(); // To access URL search params
  const navigate = useNavigate(); // For programmatic navigation

  // Extract search query from URL
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q")?.trim() || "";

  // Fetch videos based on search query from backend API
  useEffect(() => {
    if (!query) {
      // If no query, reset state and show message
      setVideos([]);
      setFilteredVideos([]);
      setError("Please enter a search term.");
      setLoading(false);
      return;
    }

    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/videos/search?q=${encodeURIComponent(query)}`
        );
        const result = Array.isArray(res.data) ? res.data : [];
        setVideos(result);

        // Show message if no videos found
        if (result.length === 0) setError("No matching videos found.");
        else setError("");
      } catch (err) {
        console.error("Search error:", err);
        setError("Something went wrong. Please try again.");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]); // Runs when search query changes

  // Filter videos when active tag changes
  useEffect(() => {
    if (activeTag === "All") {
      setFilteredVideos(videos); // Show all videos if "All" selected
    } else {
      // Filter videos by category or tags
      const filtered = videos.filter(
        (video) =>
          video.category?.toLowerCase() === activeTag.toLowerCase() ||
          video.tags?.some(
            (tag) => tag.toLowerCase() === activeTag.toLowerCase()
          )
      );
      setFilteredVideos(filtered);
    }
  }, [activeTag, videos]);

  // Navigate to video page when user clicks on a video
  const handleClickVideo = (id) => navigate(`/video/${id}`);

  return (
    <div className="search-page-container">
      {/* Tags component for filtering */}
      <Tags tags={tags} activeTag={activeTag} setActiveTag={setActiveTag} />

      {/* Show loading spinner, error message, or search results */}
      {loading ? (
        <LoadingComp />
      ) : error ? (
        <p className="search-error">{error}</p>
      ) : filteredVideos.length > 0 ? (
        <div className="search-grid">
          {filteredVideos.map((video) => (
            <div
              key={video._id || video.videoId}
              onClick={() => handleClickVideo(video._id || video.videoId)}
            >
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      ) : (
        <p className="search-error">
          No videos available for selected category or tag.
        </p>
      )}
    </div>
  );
};

export default SearchPage;
