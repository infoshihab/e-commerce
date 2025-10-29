import Order from "../models/OrderModel.js"; // assuming you have an Order model

export const getDashboardStats = async (req, res) => {
  try {
    const newOrders = await Order.countDocuments({ orderStatus: "new" });
    const pendingOrders = await Order.countDocuments({
      orderStatus: "pending",
    });
    const shippedOrders = await Order.countDocuments({
      orderStatus: "shipped",
    });
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered",
    });
    const revenue = await Order.aggregate([
      { $match: { orderStatus: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    res.json({
      newOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      revenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};
