import User from "../models/UserModel.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, guestCart } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (guestCart && guestCart.length > 0) {
        user.cart = mergeCarts(user.cart, guestCart);
        await user.save();
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        isAdmin: user.isAdmin,
        cart: user.cart || [],
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Marge Cart

const mergeCarts = (userCart = [], guestCart = []) => {
  const merged = [...userCart];
  for (const guestItem of guestCart) {
    const exist = merged.find(
      (item) => item.product.toString() === guestItem.product
    );
    if (exist) {
      exist.qty += guestItem.qty;
    } else {
      merged.push(guestItem);
    }
  }
  return merged;
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      cart: user.cart,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export { registerUser, getUserProfile, loginUser };
