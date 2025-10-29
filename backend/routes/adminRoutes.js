import express from "express";
import { getDashboardStats } from "../controllers/AdminController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, admin, getDashboardStats);

export default router;
