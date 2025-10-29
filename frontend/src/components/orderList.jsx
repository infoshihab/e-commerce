import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // Access AppContext

const OrderList = () => {
  const { orders, ordersLoading, fetchOrders, products } = useAppContext(); // Get orders and products from AppContext
  const navigate = useNavigate();

  // Local state to manage when orders are fetched
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    // Only fetch orders if they haven't been fetched yet
    if (!isFetched) {
      fetchOrders();
      setIsFetched(true); // Prevent further fetches
    }
  }, [isFetched, fetchOrders]); // Depend on isFetched to prevent repeated fetches

  const handleOrderClick = (productId) => {
    // Navigate to the product detail page using productId
    navigate(`/products/${productId}`);
  };

  if (ordersLoading) {
    return (
      <div className="text-center py-4">
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-xl text-gray-500">
          You have no orders yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex flex-col md:flex-row justify-between items-start bg-white shadow-lg rounded-lg p-6"
            >
              <div className="w-full md:w-2/5">
                <h3 className="text-xl font-medium mb-2">{`Order #${order._id}`}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="w-full md:w-1/3 mt-4 md:mt-0">
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Total: Tk {order.totalPrice}
                </p>
                <p
                  className={`text-sm font-semibold rounded-full py-1 px-4 text-white inline-block ${
                    order.status === "Completed"
                      ? "bg-green-500"
                      : order.status === "Pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  Status: {order.orderStatus || "N/A"}
                </p>
              </div>
              <div className="w-full md:w-1/3 mt-4 md:mt-0 flex flex-wrap gap-2">
                {/* Loop through orderItems and create a View Details button for each product */}
                {order.orderItems.map((item) => {
                  // Find the product from AppContext using productId
                  const product = products.find(
                    (prod) => prod._id === item.product
                  );
                  return (
                    <button
                      key={item.product}
                      onClick={() => handleOrderClick(product?._id)} // Pass the product's _id
                      className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-all duration-200"
                    >
                      View {item.name} Details
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
