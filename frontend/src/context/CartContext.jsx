// src/context/CartContext.jsx
import { createContext, useContext, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    setIsCartOpen(true);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, isCartOpen, toggleCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
