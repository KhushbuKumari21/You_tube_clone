// Import mongoose for MongoDB schema and bcrypt for password hashing
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the User schema
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true }, // unique username
    email: { type: String, required: true, unique: true }, // unique email
    password: { type: String, required: true }, // hashed password will be stored
    img: { type: String, default: "" }, // profile image URL
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }], // user's channels
  },
  { timestamps: true } // automatically add createdAt and updatedAt
);

// Middleware: Hash password before saving to DB
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // skip if password not changed
  const salt = await bcrypt.genSalt(10); // generate salt for hashing
  this.password = await bcrypt.hash(this.password, salt); // hash the password
  next();
});

// Method: Compare entered password with hashed password in DB
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
export default mongoose.model("User", UserSchema);
