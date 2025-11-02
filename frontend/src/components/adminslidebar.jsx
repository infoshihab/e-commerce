import React from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaClipboardList,
  FaTags,
  FaSignOutAlt,
} from "react-icons/fa"; // Add relevant icons

const AdminSidebar = ({ setActiveSection }) => {
  return (
    <div className="w-64 bg-orange-500 text-white fixed top-0 left-0 h-full p-6 flex flex-col">
      <h2 className="text-3xl font-semibold mb-8 text-center">Admin Panel</h2>
      <nav className="flex flex-col space-y-4">
        <Link
          to="/admin/dashboard"
          className="flex items-center p-3 rounded-md hover:bg-orange-600"
          onClick={() => setActiveSection("dashboard")}
        >
          <FaTachometerAlt className="mr-3" /> Dashboard
        </Link>

        <Link
          to="/admin/products"
          className="flex items-center p-3 rounded-md hover:bg-orange-600"
          onClick={() => setActiveSection("products")}
        >
          <FaBox className="mr-3" /> Add Product
        </Link>

        <Link
          to="/admin/orders"
          className="flex items-center p-3 rounded-md hover:bg-orange-600"
          onClick={() => setActiveSection("orders")}
        >
          <FaClipboardList className="mr-3" /> Orders
        </Link>

        <Link
          to="/admin/categories"
          className="flex items-center p-3 rounded-md hover:bg-orange-600"
          onClick={() => setActiveSection("categories")}
        >
          <FaTags className="mr-3" /> Categories
        </Link>

        <Link
          to="/admin/logout"
          className="flex items-center p-3 rounded-md hover:bg-orange-600"
        >
          <FaSignOutAlt className="mr-3" /> Logout
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
