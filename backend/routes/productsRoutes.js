import express from "express";
import {
  createProduct,
  getProducts,
  getProductsById,
  getProductsByCategory, // 👈 import it
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController.js";

import upload from "../middlewares/upload.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/:id", getProductsById);

// Admin routes
router.post("/", protect, admin, upload.single("image"), createProduct);
router.put("/:id", protect, admin, upload.single("image"), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
