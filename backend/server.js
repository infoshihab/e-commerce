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
const allowedOrigins = [
  // "https://e-commerce-kappa-hazel-37.vercel.app/",
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

// app.use(
//   cors({
//     origin: "http://localhost:5173", // Allow frontend domain
//     credentials: true, // If you're using cookies or sessions, keep this
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "frontend", "build"))); // Adjust path as needed

// Catch-all for React routes (to handle client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.use("/api/test", (req, res) => {
  res.json({ message: " Backend Works!" });
});

//Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api", categoryRoutes);
app.use("/api/admin", adminRoutes);

const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/", (req, res) => {
  res.send("Api is running...");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: "Server Error" });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
