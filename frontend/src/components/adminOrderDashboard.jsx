import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const AdminOrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACKEND_URL || "/api/orders";
        const response = await axios.get(`${apiUrl}/orders`);

        const ordersArray = Array.isArray(response.data)
          ? response.data
          : response.data.orders || response.data.data || [];

        ordersArray.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(ordersArray);
      } catch (err) {
        setError("Failed to fetch orders.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "/api/orders";
      await axios.put(`${apiUrl}/orders/${orderId}/status`, {
        status: newStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      setError("Failed to update the order status.");
    }
  };

  const handlePaymentStatus = async (orderId, status) => {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "/api/orders";
      await axios.put(`${apiUrl}/orders/${orderId}/payment-status`, {
        paymentStatus: status,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, paymentStatus: status } : order
        )
      );
    } catch (err) {
      setError("Failed to update payment status.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const apiUrl = import.meta.env.VITE_BACKEND_URL || "/api/orders";
        await axios.delete(`${apiUrl}/orders/${orderId}`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        alert("Order deleted successfully!");
      } catch (err) {
        setError("Failed to delete the order.");
      }
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const groupedOrders = {
    pending: [],
    confirmed: [],
    shipped: [],
    delivered: [],
    cancelled: [],
  };

  orders.forEach((order) => {
    groupedOrders[order.orderStatus].push(order);
  });

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Admin Order Dashboard
      </h1>

      {/* Orders grouped by Status */}
      {Object.keys(groupedOrders).map((status) => (
        <div key={status} className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">
            {status.charAt(0).toUpperCase() + status.slice(1)} Orders
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupedOrders[status].map((order) => (
              <motion.div
                key={order._id}
                className="bg-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Order ID: {order._id}
                  </h3>
                  <span
                    className={`text-sm font-semibold ${
                      status === "pending"
                        ? "text-yellow-600"
                        : status === "confirmed"
                        ? "text-green-600"
                        : status === "shipped"
                        ? "text-blue-600"
                        : status === "delivered"
                        ? "text-indigo-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.orderStatus.charAt(0).toUpperCase() +
                      order.orderStatus.slice(1)}
                  </span>
                </div>

                <div className="text-gray-700 space-y-2">
                  <p>
                    <strong>Total:</strong> Tk{" "}
                    {order.totalPrice.toLocaleString()}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    {order.paymentStatus === "successful" ? "Paid" : "Unpaid"}
                  </p>
                  <p>
                    <strong>Payment Method:</strong> {order.paymentMethod}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="font-semibold">Shipping Address:</p>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.phone}</p>
                </div>

                {/* Order Items */}
                <div className="mt-4">
                  <p className="font-semibold">Items:</p>
                  {order.orderItems.map((item) => (
                    <div
                      key={item.product}
                      className="flex items-center justify-between py-2"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="ml-4">
                        <p>{item.name}</p>
                        <p>Qty: {item.qty}</p>
                        <p>Price: Tk {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex space-x-4">
                  {status !== "shipped" && status !== "delivered" && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, "shipped")}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition-colors"
                    >
                      Ship
                    </button>
                  )}
                  {status !== "delivered" && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, "delivered")}
                      className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 transition-colors"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  {status !== "confirmed" && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, "confirmed")}
                      className="bg-green-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-700 transition-colors"
                    >
                      Confirm Order
                    </button>
                  )}
                  {status !== "cancelled" && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, "cancelled")}
                      className="bg-red-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-700 transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>

                {/* Payment Status Toggle */}
                <div className="mt-4">
                  <button
                    onClick={() =>
                      handlePaymentStatus(
                        order._id,
                        order.paymentStatus === "successful"
                          ? "pending"
                          : "successful"
                      )
                    }
                    className={`py-2 px-4 rounded-md ${
                      order.paymentStatus === "successful"
                        ? "bg-gray-600 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {order.paymentStatus === "successful"
                      ? "Mark as Unpaid"
                      : "Mark as Paid"}
                  </button>
                </div>

                {/* Delete Order */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="text-red-600 hover:text-red-800 transition-all"
                  >
                    Delete Order
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrderDashboard;
