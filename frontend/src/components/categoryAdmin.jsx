import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CategoryAdmin = () => {
  const API = import.meta.env.VITE_BACKEND_URL || "";

  // States
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionImage, setCollectionImage] = useState(null);

  // Get authorization header
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token_v1");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch categories initially
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/categories`, {
        headers: getAuthHeaders(),
      });
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  const fetchCollections = async (categoryId) => {
    if (!categoryId) return setCollections([]);
    try {
      const { data } = await axios.get(
        `${API}/collections?category=${categoryId}`,
        { headers: getAuthHeaders() }
      );
      setCollections(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch collections");
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!categoryName.trim()) return toast.error("Enter category name");
    try {
      const { data } = await axios.post(
        `${API}/categories`,
        { name: categoryName },
        { headers: getAuthHeaders() }
      );
      setCategories((prev) => [...prev, data]);
      setCategoryName("");
      toast.success("Category added successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;
    try {
      await axios.delete(`${API}/categories/${id}`, {
        headers: getAuthHeaders(),
      });
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success("Category deleted successfully");
      if (selectedCategory === id) {
        setSelectedCategory("");
        setCollections([]);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  // Add new collection
  const handleAddCollection = async () => {
    if (!selectedCategory) return toast.error("Select a category first");
    if (!collectionName.trim()) return toast.error("Enter collection name");
    if (!collectionImage) return toast.error("Upload collection image");

    const formData = new FormData();
    formData.append("name", collectionName);
    formData.append("category", selectedCategory);
    formData.append("image", collectionImage);

    try {
      const { data } = await axios.post(`${API}/collections`, formData, {
        headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
      });
      setCollections((prev) => [...prev, data]);
      setCollectionName("");
      setCollectionImage(null);
      toast.success("Collection added successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add collection");
    }
  };

  // Delete collection
  const handleDeleteCollection = async (id) => {
    if (!window.confirm("Are you sure to delete this collection?")) return;
    try {
      await axios.delete(`${API}/collections/${id}`, {
        headers: getAuthHeaders(),
      });
      setCollections((prev) => prev.filter((c) => c._id !== id));
      toast.success("Collection deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete collection");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Manage Categories & Collections
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Section */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Categories
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="New category name"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                  selectedCategory === cat._id
                    ? "bg-blue-50 border border-blue-400"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSelectedCategory(cat._id);
                  fetchCollections(cat._id);
                }}
              >
                <span className="font-medium text-gray-700">{cat.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(cat._id);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Collection Section */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Collections
          </h2>

          {!selectedCategory && (
            <p className="text-gray-500">
              Select a category to view or add collections.
            </p>
          )}

          {selectedCategory && (
            <>
              {/* Add Collection Form */}
              <div className="flex flex-col gap-3 border p-4 rounded-lg bg-gray-50">
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="Collection name"
                  className="p-2 border rounded"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCollectionImage(e.target.files[0])}
                  className="p-2 border rounded"
                />
                <button
                  onClick={handleAddCollection}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Add Collection
                </button>
              </div>

              {/* Show Collections */}
              <ul className="space-y-3 max-h-96 overflow-y-auto mt-4">
                {collections.length === 0 && (
                  <p className="text-gray-500 italic">No collections found.</p>
                )}
                {collections.map((col) => (
                  <li
                    key={col._id}
                    className="flex items-center justify-between border p-2 rounded bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={col.image || "/placeholder.png"}
                        alt={col.name}
                        className="w-16 h-16 object-cover rounded"
                      />

                      <span className="text-gray-800">{col.name}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCollection(col._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryAdmin;
