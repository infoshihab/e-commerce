import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/CartController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);

//Logged in user

router.get("/", protect, getCart);
router.delete("/:id", protect, removeFromCart);
router.delete("/", protect, clearCart);

export default router;
