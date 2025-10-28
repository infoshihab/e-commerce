// backend/routes/categoryRoutes.js
import express from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "../controllers/CategoryController.js";
import upload from "../middlewares/upload.js";

import {
  createCollection,
  getCollections,
  deleteCollection,
} from "../controllers/CollectionController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// CATEGORY ROUTES
router.post("/categories", protect, admin, createCategory); // POST /api/categories
router.get("/categories", getCategories); // GET /api/categories
router.delete("/categories/:id", protect, admin, deleteCategory); // DELETE /api/categories/:id

// COLLECTION ROUTES
router.post(
  "/collections",
  protect,
  admin,
  upload.single("image"),
  createCollection
);
router.get("/collections", getCollections); // GET /api/collections
router.delete("/collections/:id", protect, admin, deleteCollection); // DELETE /api/collections/:id

export default router;
