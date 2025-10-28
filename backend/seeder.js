import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/UserModel.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const adminUser = new User({
      name: "Admin User",
      email: "admin@gmail.com",
      password: "Shihab@", // ❌ no manual hashing
      isAdmin: true,
    });

    await adminUser.save();
    console.log("✅ Admin created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
