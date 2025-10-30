import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import "./config/cloudinary.js";
import path from "path";

import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import siteContentRoutes from "./routes/siteContentRoutes.js";

dotenv.config();
connectDB();

const app = express();
const _dirname = path.resolve();

// CORS setup (Frontend domain)
app.use(
  cors({
    origin: "http://localhost:5173" || "https://e-commerce-43zn.onrender.com/", // Allow frontend domain
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Wildcard route to serve index.html for frontend

// Test route
app.use("/api/test", (req, res) => {
  res.json({ message: "Backend Works!" });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api", categoryRoutes);
app.use("/api/admin", adminRoutes);

// Serve frontend after all routes
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("/{*any}", (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});
// Static file serving for uploads
app.use("/uploads", express.static(path.join(_dirname, "/uploads")));

// Basic health check route
app.get("/", (req, res) => {
  res.send("Api is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
