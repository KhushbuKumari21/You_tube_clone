// src/pages/UploadPage.jsx

import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import "../styles/uploadPage.css";
import { useSelector } from "react-redux";

const UploadPage = () => {
  const { currentUser } = useSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setMessage("⚠ Please select a video to upload!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("video", videoFile);
      formData.append("thumbnail", thumbnail);
      formData.append("channelId", currentUser.channelId);

      const res = await axiosInstance.post("/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("🎉 Video uploaded successfully!");
      setLoading(false);
      setTitle("");
      setDescription("");
      setVideoFile(null);
    } catch (error) {
      setMessage("❌ Upload failed! Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">

        <h2 className="upload-title">Upload Your First Video</h2>
        <p className="upload-subtitle">
          Share your content with the world 🚀
        </p>

        {message && <p className="upload-message">{message}</p>}

        <form onSubmit={handleUpload} className="upload-form">
          <label>Video Title</label>
          <input
            type="text"
            placeholder="Enter video title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            placeholder="Write something about your video..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <label>Select Video File</label>
          <input
            type="file"
            accept="video/*"
            required
            onChange={(e) => setVideoFile(e.target.files[0])}
          />

          <label>Upload Thumbnail (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />

          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
