// server.js

// Import dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js"; // MongoDB connection
import authRoutes from "./routes/auth.js"; // Auth API routes
import videoRoutes from "./routes/videos.js"; // Video API routes
import commentRoutes from "./routes/comments.js"; // Comment API routes
import channelRoutes from "./routes/channels.js"; // Channel API routes

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express();

// Enable CORS to allow frontend access
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
    credentials: true, // Allow cookies/credentials
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files for uploaded videos, thumbnails, and avatars
app.use("/videos", express.static(path.join(path.resolve(), "videos")));
app.use("/thumbnails", express.static(path.join(path.resolve(), "thumbnails")));
app.use("/avatars", express.static(path.join(path.resolve(), "avatars")));

// API route endpoints
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/channels", channelRoutes);

// Fallback route for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
