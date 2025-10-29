// Cart.jsx

import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    addToCart,
    clearCart,
    user,
    placeOrder,
    fetchCart,
  } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();

  const [showCOD, setShowCOD] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    comments: "",
    couponCode: "",
    shippingMethod: "standard",
  });

  const phonePattern = /^(01[3-9]{1}[0-9]{1})\d{7}$/;
  const shippingPrice = 50; // default shipping fee

  // Handle quantity change (increase/decrease)
  const handleQuantityChange = async (id, delta) => {
    const item = cart.find((c) => c.product === id);
    if (!item) return;

    const newQty = Math.max(1, item.qty + delta); // ensure qty is at least 1
    const change = newQty - item.qty; // calculate the change in quantity
    await addToCart(id, change); // update the cart
  };

  // Handle order submission with Cash On Delivery
  const handleCODSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!phonePattern.test(formData.phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    // Check if the user is logged in
    if (!user) {
      navigate("/login", { state: { from: location }, replace: true });
      setShowCOD(false);
      closeCart();
      return;
    }

    const shippingAddress = {
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      comments: formData.comments,
      shippingMethod: formData.shippingMethod,
      couponCode: formData.couponCode || null,
    };

    const res = await placeOrder(shippingAddress, "COD");

    if (res.success) {
      toast.success("Order placed successfully!");
      clearCart(); // Clear cart after successful order
      setFormData({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        comments: "",
        couponCode: "",
        shippingMethod: "standard",
      });
      setShowCOD(false);
      closeCart();
    } else {
      toast.error(res.message || "Failed to place order.");
    }
  };

  // Calculate total price, discount, and final total
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  const discount = formData.couponCode ? 10 : 0;

  // Fetch the cart again whenever the user state changes
  useEffect(() => {
    if (user) {
      fetchCart(); // Re-fetch cart from backend when logged in
    }
  }, [user, fetchCart]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-[45%] md:w-[40%] lg:w-[30%] bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 90 }}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-2xl text-gray-800 font-semibold">
                Shopping Cart
              </h2>
              <button
                onClick={closeCart}
                className="text-gray-600 hover:text-gray-800 text-4xl"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart && cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center gap-4 border-b pb-3"
                  >
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name || "Product"}
                      className="w-16 h-16 object-cover border rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {item.name || "Product"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Tk {item.price?.toLocaleString() || 0} × {item.qty || 1}{" "}
                        ={" "}
                        <span className="font-semibold">
                          Tk {(item.price || 0) * (item.qty || 1)}
                        </span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.product, -1)}
                          className="px-2 border rounded hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span>{item.qty || 1}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product, 1)}
                          className="px-2 border rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 mt-10">
                  Your cart is empty.
                </p>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-4 border-t">
                <div className="mb-2 font-semibold text-gray-700">
                  Total: Tk {totalPrice.toLocaleString()}
                </div>
                <div className="mb-2 font-semibold text-gray-700">
                  Shipping: Tk {shippingPrice.toLocaleString()}
                </div>
                <div className="mb-2 font-semibold text-gray-700">
                  Discount: Tk {discount.toLocaleString()}
                </div>
                <div className="mb-2 font-semibold text-gray-700">
                  Final Total: Tk{" "}
                  {(totalPrice + shippingPrice - discount).toLocaleString()}
                </div>
                <button
                  onClick={() => setShowCOD(true)} // show COD form popup
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition"
                >
                  Cash on Delivery
                </button>

                {showCOD && (
                  <motion.div
                    className="fixed inset-0 bg-white z-50 flex justify-center items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-full sm:w-[60%] md:w-[50%] lg:w-[40%] bg-white p-6 rounded-lg shadow-lg">
                      <h3 className="text-2xl font-semibold mb-4">
                        Order Information
                      </h3>
                      <form
                        onSubmit={handleCODSubmit}
                        className="flex flex-col gap-4"
                      >
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="border p-2 rounded"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="Phone"
                          className="border p-2 rounded"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="Address"
                          className="border p-2 rounded"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="City"
                          className="border p-2 rounded"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="Postal Code"
                          className="border p-2 rounded"
                          value={formData.postalCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              postalCode: e.target.value,
                            })
                          }
                          required
                        />
                        <textarea
                          placeholder="Comments"
                          className="border p-2 rounded resize-none"
                          rows={3}
                          value={formData.comments}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              comments: e.target.value,
                            })
                          }
                        />
                        <button
                          type="submit"
                          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                        >
                          Confirm Order
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
