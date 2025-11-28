// D:\youtube-clone\backend\routes\auth.js
import express from "express";
import { signup, signin } from "../controllers/authController.js";

const router = express.Router();

// Routes delegate logic to controller
router.post("/signup", signup);
router.post("/signin", signin);

export default router;
