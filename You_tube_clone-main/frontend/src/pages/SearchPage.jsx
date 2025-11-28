import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance"; // Axios instance with baseURL
import VideoCard from "../components/VideoCard";
import LoadingComp from "../components/LoadingComp";
import Tags from "../components/Tags";
import { DEFAULT_TAGS } from "../constants";
import "../styles/search.css";

const SearchPage = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [tags] = useState(DEFAULT_TAGS);
  const [activeTag, setActiveTag] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Extract search query from URL
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q")?.trim() || "";

  // Fetch videos by search query
  useEffect(() => {
    if (!query) {
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
  }, [query]);

  // Filter videos based on active category/tag
  useEffect(() => {
    if (activeTag === "All") {
      setFilteredVideos(videos);
    } else {
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

  const handleClickVideo = (id) => navigate(`/video/${id}`);

  return (
    <div className="search-page-container">
      <Tags tags={tags} activeTag={activeTag} setActiveTag={setActiveTag} />

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
