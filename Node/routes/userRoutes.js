import express from "express";
import {signup, login, updateProfile} from "../controllers/userController.js";

import authMiddleware from "../middlewares/authMiddleware.js"; // Assumes you have JWT middleware

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected route for updating profile
router.put("/update/profile", authMiddleware, updateProfile);

export default router;
