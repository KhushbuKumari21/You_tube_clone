// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import channelRoutes from "./routes/channels.js";

dotenv.config();
connectDB();

const app = express();

// Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON requests
app.use(express.json());

// Serve static files
app.use("/videos", express.static(path.join(path.resolve(), "videos")));
app.use("/thumbnails", express.static(path.join(path.resolve(), "thumbnails")));
app.use("/avatars", express.static(path.join(path.resolve(), "avatars")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/channels", channelRoutes);

// Fallback route for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
