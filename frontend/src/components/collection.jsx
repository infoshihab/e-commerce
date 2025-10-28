import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_BACKEND_URL || "";

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/collections`);
        setCollections(data);
      } catch (error) {
        console.error("Fetch collections error:", error);
        toast.error("Failed to load collections");
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, [API]);

  if (loading) {
    return (
      <div className="w-full h-[40vh] flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading collections...</p>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="w-full h-[40vh] flex items-center justify-center">
        <p className="text-lg text-gray-600">No collections found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-4xl text-center mb-10 text-gray-900">Collections</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {collections.map((collection) => (
          <Link
            to={`/category/${collection.category?._id}`}
            key={collection._id}
            className="block group bg-white border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-xl transition-all transform hover:-translate-y-2"
          >
            <div className="relative w-full h-52 overflow-hidden">
              <img
                src={collection.image || "/placeholder.png"}
                alt={collection.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-base md:text-lg font-medium text-gray-800 capitalize">
                {collection.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Collection;
