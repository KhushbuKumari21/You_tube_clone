// src/components/Comments.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../axiosInstance";
import Comment from "./Comment";
import "../styles/comments.css";

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [desc, setDesc] = useState("");

  // Token fallback
  const token =
    currentUser?.token ||
    JSON.parse(localStorage.getItem("currentUser"))?.token;

  // Fetch comments
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
    if (!desc.trim()) return;
    if (!token) return alert("Login to comment");

    try {
      const res = await axiosInstance.post(
        "/comments",
        { text: desc, video: videoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [...prev, res.data]);
      setDesc("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className="comments-container">
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
          <Link to="/signin" className="comment-btn">
            Comment
          </Link>
        )}
      </div>

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
