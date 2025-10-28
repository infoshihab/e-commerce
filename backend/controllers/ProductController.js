import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import Product from "../models/ProductModel.js";

// Upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce/products" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const result = await uploadToCloudinary(req.file.buffer);

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: [{ url: result.secure_url, public_id: result.public_id }],
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET PRODUCTS BY CATEGORY (NEW)
// GET PRODUCTS BY CATEGORY ID
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId }).sort({
      createdAt: -1,
    });

    // If no products, return an empty array (not an error)
    if (!products || products.length === 0) {
      return res.json({ success: true, products: [] });
    }

    res.json({ success: true, products });
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET PRODUCT BY ID
const getProductsById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, description, price, category, stock } = req.body;

    if (req.file) {
      if (product.images[0]?.public_id) {
        await cloudinary.uploader.destroy(product.images[0].public_id);
      }
      const result = await uploadToCloudinary(req.file.buffer);
      product.images = [
        { url: result.secure_url, public_id: result.public_id },
      ];
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.images[0]?.public_id) {
      await cloudinary.uploader.destroy(product.images[0].public_id);
    }

    await product.deleteOne();
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createProduct,
  getProducts,
  getProductsById,
  getProductsByCategory, // 👈 export new function
  updateProduct,
  deleteProduct,
};
