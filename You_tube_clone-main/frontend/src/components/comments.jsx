// src/components/Comments.jsx

// React + Redux + Router imports
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../axiosInstance";

// Child component for each comment
import Comment from "./Comment";
import "../styles/comments.css";

const Comments = ({ videoId }) => {
  // Get current logged-in user from Redux
  const { currentUser } = useSelector((state) => state.user);

  // Local state
  const [comments, setComments] = useState([]); // store all comments
  const [desc, setDesc] = useState(""); // new comment text

  // Token fallback: prefer Redux, then localStorage
  const token =
    currentUser?.token ||
    JSON.parse(localStorage.getItem("currentUser"))?.token;

  // Fetch comments for the given video
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/comments/${videoId}`);
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setComments([]);
      }
    };

    fetchComments();
  }, [videoId]);

  // Submit new comment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!desc.trim()) return; // ignore empty comments
    if (!token) return alert("Login to comment");

    try {
      const res = await axiosInstance.post(
        "/comments",
        { text: desc, video: videoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add new comment to state
      setComments((prev) => [...prev, res.data]);
      setDesc(""); // clear input
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className="comments-container">
      {/* New Comment Input */}
      <div className="new-comment">
        <div className="comment-avatar">
          {currentUser?.img ? (
            <img src={currentUser.img} alt="user" />
          ) : (
            <div className="avatar-fallback">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <input
          className="comment-input"
          placeholder="Add a public comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {currentUser ? (
          <button className="comment-btn" onClick={handleSubmit}>
            Comment
          </button>
        ) : (
          // Redirect to signin if user not logged in
          <Link to="/signin" className="comment-btn">
            Comment
          </Link>
        )}
      </div>

      {/* Display All Comments */}
      <div className="all-comments">
        {comments.length > 0 ? (
          comments.map((cmt) => (
            <Comment key={cmt._id} comment={cmt} setComments={setComments} />
          ))
        ) : (
          <p className="no-comments">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
