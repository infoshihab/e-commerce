import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  addOrUpdateContent,
  getContent,
  deleteBanner,
} from "../controllers/SiteController.js";
import multer from "multer";

const router = express.Router();

// Use multer memory storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Admin: add/update site content (supports multiple uploads)
router.post(
  "/",
  protect,
  admin,
  upload.fields([
    { name: "banners", maxCount: 5 },
    { name: "logo", maxCount: 1 },
  ]),
  addOrUpdateContent
);
router.delete("/banner/:bannerId", protect, admin, deleteBanner);

// Public: get site content
router.get("/", getContent);

export default router;
