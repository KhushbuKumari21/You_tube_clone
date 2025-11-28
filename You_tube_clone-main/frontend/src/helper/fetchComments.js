// helper/fetchComments.js

import axios from "axios";

// Fetch all comments for a specific video
export const fetchComments = async (videoId, setComments) => {
  try {
    // GET request to backend API
    // Example: /comments/123
    const res = await axios.get(`/comments/${videoId}`);

    // Set comments in state
    setComments(res.data);
  } catch (err) {
    console.error("Failed to fetch comments:", err);
  }
};
