import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import DB and Cloudinary configurations
import connectDB from "./config/db.js";
import "./config/cloudinary.js";

// Import Routes
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import siteContentRoutes from "./routes/siteContentRoutes.js";

// Load environment variables
dotenv.config();

// Connect to DB
connectDB();

// Initialize the app
const app = express();

// CORS configuration
const allowedOrigins = [
  "https://e-commerce-43zn.onrender.com",
  "https://e-commercebackend-y002.onrender.com",
];

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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api", categoryRoutes);
app.use("/api/admin", adminRoutes);

// Serve Static Files (Uploads)
const __filename = fileURLToPath(import.meta.url); // Get the current filename
const __dirname = path.dirname(__filename); // Get the current directory path

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve Admin Static Files
const adminPath = path.join(__dirname, "public", "admin");
app.use("/admin", express.static(adminPath));
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});

// Serve Frontend Static Files (React App)
const frontendPath = path.join(__dirname, "public", "frontend");
app.use(express.static(frontendPath));

// Catch-all route for React Router handling
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Default route for API health check
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
