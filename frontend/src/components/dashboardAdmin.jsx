import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaDollarSign,
  FaClipboardList,
  FaImages,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import AppContext from "../context/AppContext.jsx";
import { Line } from "react-chartjs-2"; // To use for the trend graph
import { Chart as ChartJS } from "chart.js/auto"; // To import chart.js

const AdminDashboard = () => {
  const { user } = useContext(AppContext);
  const [stats, setStats] = useState({
    newOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  // const API = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch dashboard stats from the backend
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/dashboard`
        );
        console.log("Fetched Dashboard Stats:", data); // Debugging log
        setStats(data); // Update the state with the fetched stats
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-orange-500 text-lg font-medium">Loading...</p>
      </div>
    );

  // Example data for the trends section
  const data = {
    labels: ["9 AM", "12 PM", "3 PM", "6 PM", "9 PM"],
    datasets: [
      {
        label: "Today",
        data: [30, 38, 35, 50, 45],
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Yesterday",
        data: [28, 34, 30, 45, 40],
        borderColor: "rgba(192, 75, 192, 1)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  // Chart options to make it smaller and responsive
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: "#f0f0f0",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#f0f0f0",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-8 text-center">
        Admin Dashboard
      </h1>

      {/* Welcome Section */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome, {user?.name || "Admin"} 👋
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your products, orders, and site content from one place.
        </p>
      </div>

      {/* Revenue and Orders Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Shipped Orders", value: stats.shippedOrders },
          { title: "Pending Orders", value: stats.pendingOrders },
          { title: "New Orders", value: stats.newOrders },
          { title: "Delivered Orders", value: stats.deliveredOrders },
          { title: "Total Revenue", value: `$${stats.revenue}` },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-xl rounded-xl p-6 flex items-center justify-between space-x-4 hover:bg-gray-100 transition duration-300 ease-in-out"
          >
            <div>
              <p className="text-gray-500">{item.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
            </div>
            <div>
              <FaDollarSign className="text-orange-500 text-3xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Today's Trends Graph */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Today's Trends
        </h2>
        <div className="relative h-72">
          <Line data={data} options={chartOptions} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="bg-white shadow-xl hover:shadow-2xl rounded-2xl p-6 flex flex-col items-center transition-transform hover:-translate-y-1"
        >
          <FaClipboardList size={48} className="text-orange-500 mb-3" />
          <h3 className="text-xl font-semibold text-gray-800">
            Manage Products
          </h3>
          <p className="text-gray-500 text-center mt-2">
            Add, edit, or remove products from your store.
          </p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white shadow-xl hover:shadow-2xl rounded-2xl p-6 flex flex-col items-center transition-transform hover:-translate-y-1"
        >
          <FaShoppingCart size={48} className="text-orange-500 mb-3" />
          <h3 className="text-xl font-semibold text-gray-800">Manage Orders</h3>
          <p className="text-gray-500 text-center mt-2">
            Track and process customer orders efficiently.
          </p>
        </Link>

        <Link
          to="/admin/site-content"
          className="bg-white shadow-xl hover:shadow-2xl rounded-2xl p-6 flex flex-col items-center transition-transform hover:-translate-y-1"
        >
          <FaImages size={48} className="text-orange-500 mb-3" />
          <h3 className="text-xl font-semibold text-gray-800">Site Content</h3>
          <p className="text-gray-500 text-center mt-2">
            Update About, Policy, and Homepage Banners.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
