import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import your database connection and configurations
import connectDB from "./config/db.js";
import "./config/cloudinary.js";

// Import your routes
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import siteContentRoutes from "./routes/siteContentRoutes.js";

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  "https://e-commerce-43zn.onrender.com",
  "https://e-commercebackend-y002.onrender.com",
];

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // If you're using cookies or sessions, keep this
  })
);

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test API route to check if backend is working
app.use("/api/test", (req, res) => {
  res.json({ message: "Backend Works!" });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api", categoryRoutes);
app.use("/api/admin", adminRoutes);

// Handling static files (uploads)
const __filename = fileURLToPath(import.meta.url); // Get the current filename
const __dirname = path.dirname(__filename); // Get the current directory path

// Serve static files (uploads) from the /uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve React build files
app.use(express.static(path.join(__dirname, "frontend", "build"))); // Serve static React files from the build folder

// Catch-all for React Router routes (should be after all API routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// Default route for API
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// Start the server
const port = process.env.PORT || 5000; // Default to 5000 if no PORT is set
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
