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
app.use(
  cors({
    origin: "https://e-commercebackend-y002.onrender.com", // your frontend origin
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
