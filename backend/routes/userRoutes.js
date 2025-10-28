import express from "express";

import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/UserController.js";
import { getDashboardStats } from "../controllers/AdminController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/profile", protect, getUserProfile);

// Admin Dashboard Route
router.get("/dashboard", protect, admin, getDashboardStats);
export default router;
