// backend/controllers/CartController.js
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";

const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    const cartWithDetails = user.cart.map((item) => ({
      product: item.product._id,
      qty: item.qty,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images?.[0]?.url || "/placeholder.png",
    }));
    res.json(cartWithDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product Not Found" });

    const user = await User.findById(req.user._id);
    const exist = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (exist) {
      exist.qty += qty;
    } else {
      user.cart.push({ product: productId, qty });
    }

    await user.save();

    // repopulate full product data
    const populatedUser = await User.findById(user._id).populate(
      "cart.product"
    );
    const detailedCart = populatedUser.cart.map((item) => ({
      product: item.product._id,
      qty: item.qty,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images?.[0]?.url || "/placeholder.png",
    }));

    res.json(detailedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(
    (item) => item.product.toString() !== req.params.id
  );
  await user.save();

  const populatedUser = await User.findById(user._id).populate("cart.product");
  const detailedCart = populatedUser.cart.map((item) => ({
    product: item.product._id,
    qty: item.qty,
    name: item.product.name,
    price: item.product.price,
    image: item.product.images?.[0]?.url || "/placeholder.png",
  }));

  res.json(detailedCart);
};

const clearCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json({ message: "Cart Cleared" });
};

export { getCart, addToCart, removeFromCart, clearCart };
