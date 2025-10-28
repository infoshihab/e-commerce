import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const CategoryProduct = () => {
  const { categoryId } = useParams();
  const { addToCart, openCart } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_BACKEND_URL || "";

  // Fetch products by category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API}/products/category/${categoryId}`
        );
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error("Fetch category products error:", error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API, categoryId]);

  // Quick add to cart
  const handleQuickAdd = async (product) => {
    try {
      const res = await addToCart(product._id, 1); // already opens cart
      if (res.success) {
        toast.success(`${product.name} added to cart`);
      } else {
        toast.error("Failed to add product to cart");
      }
    } catch (err) {
      console.error("Quick add error:", err);
      toast.error("Failed to add product to cart");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[40vh] flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full h-[40vh] flex items-center justify-center">
        <p className="text-lg text-gray-600">
          No products found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-4xl text-center mb-10 text-gray-900">
        Category Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <article
            key={product._id}
            className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 rounded-lg overflow-hidden flex flex-col"
          >
            <Link
              to={`/products/${product._id}`}
              className="flex flex-col h-full"
            >
              <div className="relative w-full h-64 overflow-hidden group p-4">
                <img
                  src={product.images?.[0]?.url || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {product.discount} OFF
                  </div>
                )}
              </div>
              <div className="px-4 py-3 text-center flex flex-col justify-between flex-1">
                <h3 className="text-sm md:text-base text-gray-900 line-clamp-2 mb-2">
                  {product.name}
                </h3>
                <div className="flex flex-col gap-2">
                  <p className="text-lg text-orange-500">Tk {product.price}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      Tk {product.originalPrice}
                    </p>
                  )}
                </div>
              </div>
            </Link>
            <div className="px-4 pb-4 pt-2 flex justify-center">
              <button
                onClick={() => handleQuickAdd(product)}
                className="inline-block rounded-lg bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 text-sm md:text-base focus:outline-none"
              >
                Quick Add
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CategoryProduct;
