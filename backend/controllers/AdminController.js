// In your AdminController.js or equivalent file
import Order from "../models/OrderModel.js";

// Fetch Order Stats for the dashboard
const getDashboardStats = async (req, res) => {
  try {
    // Fetching stats from the database
    const newOrders = await Order.countDocuments({ status: "new" });
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const shippedOrders = await Order.countDocuments({ status: "shipped" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });

    // Sum revenue only for paid orders
    const revenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);

    const stats = {
      newOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      revenue: revenue.length > 0 ? revenue[0].totalRevenue : 0,
    };

    res.json(stats);
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ error: "Error fetching stats" });
  }
};

export { getDashboardStats };
