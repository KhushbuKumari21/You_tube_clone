// src/components/Comment.jsx
// Component to display a single comment with edit and delete functionality

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { format } from "timeago.js";
import axiosInstance from "../axiosInstance";
import "../styles/comment.css";

const Comment = ({ comment, setComments }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [editedText, setEditedText] = useState(comment.text); // Edited text state

  const user = comment.user || { _id: null, username: "Unknown", img: null };

  // Token fallback from Redux state or localStorage
  const token =
    currentUser?.token ||
    JSON.parse(localStorage.getItem("currentUser"))?.token;

  // Delete comment
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/comments/${comment._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove deleted comment from state
      setComments((prev) => prev.filter((c) => c._id !== comment._id));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  // Update comment
  const handleUpdate = async () => {
    if (!editedText.trim()) return;
    try {
      await axiosInstance.put(
        `/comments/${comment._id}`,
        { text: editedText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false); // Exit edit mode
      // Update comment text in state
      setComments((prev) =>
        prev.map((c) =>
          c._id === comment._id ? { ...c, text: editedText } : c
        )
      );
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  return (
    <div className="comment-box">
      {/* User avatar or fallback letter */}
      {user.img ? (
        <img className="comment-user-img" src={user.img} alt="user" />
      ) : (
        <div className="avatar-fallback">
          {user.username?.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Comment content */}
      <div className="comment-details">
        <div className="comment-header">
          <span className="comment-name">{user.username}</span>
          <span className="comment-date">{format(comment.createdAt)}</span>
        </div>

        {isEditing ? (
          <div className="edit-container">
            <input
              className="edit-input"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <div className="edit-actions">
              <button className="save-btn" onClick={handleUpdate}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.text}</p>
        )}
      </div>

      {/* Edit/Delete buttons for comment owner */}
      {currentUser?._id === user._id && !isEditing && (
        <div className="comment-edit-delete">
          <span className="edit-icon" onClick={() => setIsEditing(true)}>
            <MdEdit />
          </span>
          <span className="delete-icon" onClick={handleDelete}>
            <MdOutlineDelete />
          </span>
        </div>
      )}
    </div>
  );
};

export default Comment;
