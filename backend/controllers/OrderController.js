import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";

// Place order
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    // Create an order with the received data
    const order = await Order.create({
      user: req.user._id, // Ensure we use the user's _id from the request
      orderItems: items.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.product, // reference to product ID
      })),
      shippingAddress,
      paymentMethod,
      status: "pending",
      totalPrice: items.reduce((acc, item) => acc + item.price * item.qty, 0), // Calculate total price
    });

    res.status(201).json(order); // Respond with the created order
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// Get my orders (user-specific)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get order ID
    const { status } = req.body; // New status

    // Validate status
    if (
      !["pending", "confirmed", "cancelled", "shipped", "delivered"].includes(
        status
      )
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find the order
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status
    order.orderStatus = status; // Ensure you're updating the correct field
    await order.save(); // Save to the database

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Failed to update order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// Controller: Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get order ID
    const { paymentStatus } = req.body; // Get payment status

    // Validate payment status (successful, pending)
    if (!["successful", "pending"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update payment status
    order.paymentStatus = paymentStatus;
    await order.save(); // Save changes to database

    res.status(200).json({ message: "Payment status updated", order });
  } catch (error) {
    console.error("Failed to update payment status:", error);
    res.status(500).json({ message: "Failed to update payment status" });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params; // Get order ID from URL

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Use deleteOne instead of remove
    await Order.deleteOne({ _id: id }); // Remove the order from the database
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Failed to delete order:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

export {
  placeOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
  deleteOrder,
  updatePaymentStatus,
};
