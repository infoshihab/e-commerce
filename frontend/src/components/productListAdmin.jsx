import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext.jsx";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const placeholder = "/placeholder.png";

const resolveImageUrl = (product) => {
  if (!product) return placeholder;
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0]?.url || placeholder;
  }
  return placeholder;
};

const ProductListAdmin = () => {
  const { user } = useContext(AppContext);
  const API = import.meta.env.VITE_BACKEND_URL;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [addData, setAddData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: null,
  });

  const [editData, setEditData] = useState({
    _id: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const headers = {
    Authorization: `Bearer ${user?.token}`,
  };

  // ✅ Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/products`);
      setProducts(data.products || data);
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/categories`, { headers });
      setCategories(data);
    } catch (err) {
      console.error("Fetch categories error:", err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    }
  };

  // ✅ Add product
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = new FormData();
      Object.entries(addData).forEach(([key, value]) => {
        if (value !== null) form.append(key, value);
      });

      const { data } = await axios.post(`${API}/products`, form, { headers });
      setProducts((prev) => [...prev, data.product || data]);
      toast.success("Product added successfully");
      setShowAdd(false);
      setAddData({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        image: null,
      });
    } catch (err) {
      console.error("Add error:", err);
      toast.error("Add product failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Open edit modal
  const openEdit = (product) => {
    setEditData({
      _id: product._id,
      name: product.name || "",
      category: product.category?._id || product.category || "",
      price: product.price || "",
      stock: product.stock || "",
      description: product.description || "",
      image: null,
    });
    setShowEdit(true);
  };

  // ✅ Edit product
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = new FormData();
      Object.entries(editData).forEach(([key, value]) => {
        if (key !== "_id" && value !== null) form.append(key, value);
      });

      const { data } = await axios.put(
        `${API}/products/${editData._id}`,
        form,
        { headers }
      );

      setProducts((prev) =>
        prev.map((p) => (p._id === data.product._id ? data.product : p))
      );
      toast.success("Product updated successfully");
      setShowEdit(false);
    } catch (err) {
      console.error("Edit error:", err);
      toast.error("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-orange-500 animate-pulse">Loading products...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-orange-500">
              Manage Products
            </h1>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              <FaPlus /> Add New Product
            </button>
          </div>

          {/* Product Table */}
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img
                          src={resolveImageUrl(p)}
                          alt={p.name}
                          className="w-16 h-16 rounded-md object-cover border"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.category?.name || p.category}
                      </td>
                      <td className="px-4 py-3 font-semibold">${p.price}</td>
                      <td className="px-4 py-3">{p.stock}</td>
                      <td className="px-4 py-3 text-center space-x-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ✅ Add Product Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={() => setShowAdd(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-semibold text-orange-500 mb-4">
              Add Product
            </h2>
            <form onSubmit={handleAddSubmit} className="grid gap-3">
              <input
                required
                placeholder="Name"
                value={addData.name}
                onChange={(e) =>
                  setAddData({ ...addData, name: e.target.value })
                }
                className="border rounded p-2"
              />

              {/* ✅ Category dropdown */}
              <select
                required
                value={addData.category}
                onChange={(e) =>
                  setAddData({ ...addData, category: e.target.value })
                }
                className="border rounded p-2"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={addData.price}
                  onChange={(e) =>
                    setAddData({ ...addData, price: e.target.value })
                  }
                  className="border rounded p-2"
                />
                <input
                  required
                  type="number"
                  placeholder="Stock"
                  value={addData.stock}
                  onChange={(e) =>
                    setAddData({ ...addData, stock: e.target.value })
                  }
                  className="border rounded p-2"
                />
              </div>

              <textarea
                required
                placeholder="Description"
                value={addData.description}
                onChange={(e) =>
                  setAddData({ ...addData, description: e.target.value })
                }
                className="border rounded p-2"
              />

              <input
                required
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setAddData({ ...addData, image: e.target.files[0] })
                }
                className="border rounded p-2"
              />

              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
              >
                {submitting ? "Adding..." : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Edit Product Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={() => setShowEdit(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-semibold text-orange-500 mb-4">
              Edit Product
            </h2>
            <form onSubmit={handleEditSubmit} className="grid gap-3">
              <input
                required
                placeholder="Name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="border rounded p-2"
              />

              {/* ✅ Category dropdown */}
              <select
                required
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
                className="border rounded p-2"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={editData.price}
                  onChange={(e) =>
                    setEditData({ ...editData, price: e.target.value })
                  }
                  className="border rounded p-2"
                />
                <input
                  required
                  type="number"
                  placeholder="Stock"
                  value={editData.stock}
                  onChange={(e) =>
                    setEditData({ ...editData, stock: e.target.value })
                  }
                  className="border rounded p-2"
                />
              </div>

              <textarea
                required
                placeholder="Description"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="border rounded p-2"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditData({ ...editData, image: e.target.files[0] })
                }
                className="border rounded p-2"
              />

              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
              >
                {submitting ? "Updating..." : "Update Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListAdmin;
