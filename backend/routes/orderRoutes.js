import express from "express";
import {
  placeOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder, // Import deleteOrder controller
} from "../controllers/OrderController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.put("/:id/payment-status", updatePaymentStatus);
router.delete("/:id", protect, admin, deleteOrder); // Add DELETE route for order

export default router;
