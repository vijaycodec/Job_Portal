import express from "express";
import {signup, login, updateProfile} from "../controllers/userController.js";
import {registerCompany, getCompany, getCompanyById, updateCompany} from "../controllers/company.controller.js";

import authMiddleware from "../middlewares/authMiddleware.js"; // Assumes you have JWT middleware

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected route for updating profile
router.put("/update/profile", authMiddleware, updateProfile);

router.post("/register/company", authMiddleware,registerCompany);
router.get("/get/company", authMiddleware,getCompany);
router.get("/getcompany/:id", authMiddleware,getCompanyById);
router.put("/update/company/:id", authMiddleware,updateCompany);

export default router;
