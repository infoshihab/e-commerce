import Collection from "../models/CollectionModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Utility: Upload image buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "collections" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// CREATE COLLECTION
export const createCollection = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category)
      return res
        .status(400)
        .json({ message: "Name and category are required" });

    if (!req.file)
      return res.status(400).json({ message: "Image file is required" });

    const uploadResult = await uploadToCloudinary(req.file.buffer);

    const collection = await Collection.create({
      name,
      category,
      image: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
    });

    res.status(201).json(collection);
  } catch (err) {
    console.error("Error in createCollection:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET COLLECTIONS (with optional category filter)
export const getCollections = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const query = categoryId ? { category: categoryId } : {};

    const collections = await Collection.find(query)
      .populate("category", "name _id")
      .sort({ createdAt: -1 });

    res.json(collections);
  } catch (err) {
    console.error("Error in getCollections:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE COLLECTION
export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findById(id);
    if (!collection)
      return res.status(404).json({ message: "Collection not found" });

    // Delete image from Cloudinary
    if (collection.image?.public_id) {
      await cloudinary.uploader.destroy(collection.image.public_id);
    }

    await collection.deleteOne();
    res.json({ message: "Collection deleted successfully" });
  } catch (err) {
    console.error("Error in deleteCollection:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
