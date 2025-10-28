import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please enter product name"],
      trim: true,
    },
    description: {
      type: String,
      require: [true, "Please enter product descrption"],
    },
    price: {
      type: Number,
      require: [true, "Please enter product price"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // reference Category
      required: true,
    },
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection", // reference Collection (optional)
    },
    stock: {
      type: Number,
      require: [true, "Please enter stock quantity"],
      default: 0,
    },
    images: [
      { url: { type: String, require: true }, public_id: { type: String } },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
