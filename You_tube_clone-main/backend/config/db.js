// Import mongoose for MongoDB interaction
import mongoose from "mongoose";
// Import dotenv to access environment variables
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config(); 

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,       // Use the new URL parser
      useUnifiedTopology: true,    // Use the new server discovery and monitoring engine
    });

    // Log success message with the host of the MongoDB server
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    // Log any connection error
    console.error("MongoDB connection error:", err);
    // Exit the process with failure
    process.exit(1);
  }
};

// Export the connectDB function for use in server.js
export default connectDB;
