import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // Access AppContext

const OrderList = () => {
  const { orders, ordersLoading } = useAppContext(); // Get orders from AppContext
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally, if orders are empty, you might want to force a fetch
    if (orders.length === 0) {
      // handle loading state or call fetchOrders again if needed
    }
  }, [orders]);

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (ordersLoading) {
    return (
      <div className="text-center py-4">
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex justify-between items-center bg-white shadow-md rounded-lg p-4"
            >
              <div>
                <h3 className="text-lg font-medium">{`Order #${order._id}`}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Total: ${order.totalPrice}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    order.status === "Completed"
                      ? "text-green-500"
                      : order.status === "Pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  Status: {order.status}
                </p>
              </div>
              <button
                onClick={() => handleOrderClick(order._id)}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
