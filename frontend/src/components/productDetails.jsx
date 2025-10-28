// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams(); // product ID from URL
  const { addToCart } = useAppContext();
  const API = import.meta.env.VITE_BACKEND_URL || "";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/products/${id}`);
        setProduct(data?.product ?? data);
      } catch (err) {
        console.error("Fetch product error:", err);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [API, id]);

  const handleAddToCart = async () => {
    if (!product?._id) return;
    const res = await addToCart(product._id, qty);
    if (res.success) toast.success(`${product.name} added to cart`);
    else toast.error(res.message || "Failed to add product to cart");
  };

  if (loading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Product Images */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <div className="w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
            <img
              src={product.images?.[0]?.url || "/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Thumbnails if multiple images */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 hover:border-orange-500 cursor-pointer"
                >
                  <img
                    src={img.url}
                    alt={`${product.name}-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          <div className="flex items-center gap-4">
            {product.discount && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {product.discount} OFF
              </span>
            )}
            <p className="text-2xl md:text-3xl text-orange-500 font-bold">
              Tk {product.price}
            </p>
            {product.originalPrice && (
              <p className="text-gray-500 line-through text-lg">
                Tk {product.originalPrice}
              </p>
            )}
          </div>

          <div className="text-gray-700 space-y-2">
            <h2 className="font-semibold text-lg">Description:</h2>
            <p className="text-sm md:text-base">
              {product.description || "No description available."}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <label htmlFor="qty" className="font-medium">
              Quantity:
            </label>
            <input
              id="qty"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value))}
              className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Optional Extra Details / Smooth Description */}
      {product.extraDetails && (
        <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4">More Details</h3>
          <p className="text-gray-700">{product.extraDetails}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
