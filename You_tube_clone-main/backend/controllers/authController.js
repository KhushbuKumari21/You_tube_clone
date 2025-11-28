// D:\youtube-clone\backend\controllers\authController.js
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// ================= SIGNUP ==================
export const signup = async (req, res) => {
  try {
    const { username, email, password, img } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = await User.create({ username, email, password, img });

    // Return user info without password
    const userData = newUser.toObject();
    delete userData.password;

    res
      .status(201)
      .json({ message: "User registered successfully", user: userData });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ================= SIGNIN ==================
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Generate token
    const token = generateToken(user._id);

    // Return user info without password
    const userData = user.toObject();
    delete userData.password;

    res
      .status(200)
      .json({ message: "Login successful", token, user: userData });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error during signin" });
  }
};
