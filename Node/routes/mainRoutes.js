import express from "express";
import userRoutes from "./userRoutes.js";

const router = express.Router();

// Group routes under /api/
router.use('/auth', userRoutes);

export default router;

