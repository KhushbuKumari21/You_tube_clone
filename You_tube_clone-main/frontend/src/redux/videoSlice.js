// src/redux/videoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentVideo: null,
  loading: false,
  error: null,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    fetchVideoStart: (state) => {
      state.loading = true;
    },
    fetchVideoSuccess: (state, action) => {
      state.loading = false;
      state.currentVideo = action.payload;
    },
    fetchVideoFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Add like reducer
    like: (state, action) => {
      if (!state.currentVideo.likes.includes(action.payload)) {
        state.currentVideo.likes.push(action.payload);
        // remove from dislikes if present
        state.currentVideo.dislikes = state.currentVideo.dislikes.filter(
          (id) => id !== action.payload
        );
      }
    },
    // Add dislike reducer
    dislike: (state, action) => {
      if (!state.currentVideo.dislikes.includes(action.payload)) {
        state.currentVideo.dislikes.push(action.payload);
        // remove from likes if present
        state.currentVideo.likes = state.currentVideo.likes.filter(
          (id) => id !== action.payload
        );
      }
    },
    // Optional: update video info
    updateVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
  },
});

export const {
  fetchVideoStart,
  fetchVideoSuccess,
  fetchVideoFailure,
  like,
  dislike,
  updateVideo,
} = videoSlice.actions;

export default videoSlice.reducer;
