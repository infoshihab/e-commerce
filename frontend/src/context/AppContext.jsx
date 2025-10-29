// AppContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

const GUEST_CART_KEY = "guest_cart_v1";
const TOKEN_KEY = "token_v1";
const USER_KEY = "user_v1";

const saveGuestCart = (cart) =>
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart || []));
const readGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const readToken = () => localStorage.getItem(TOKEN_KEY) || "";
const readUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AppProvider = ({ children }) => {
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

  const initialToken = readToken();
  const initialUser = readUser();

  if (initialToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }

  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);
  const [authLoading, setAuthLoading] = useState(true);

  const [siteContent, setSiteContent] = useState({
    about: "",
    policies: "",
    banners: [],
  });
  const [siteLoading, setSiteLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [cart, setCart] = useState(() => readGuestCart());
  const [cartLoading, setCartLoading] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Keep axios header in sync
  useEffect(() => {
    if (token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axios.defaults.headers.common["Authorization"];
  }, [token]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([fetchSiteContent(), fetchProducts()]);
      } catch {}

      if (!initialToken) {
        setAuthLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API}/users/profile`);
        const profile = res.data?.user ?? res.data;
        setUser(profile);
        if (profile) localStorage.setItem(USER_KEY, JSON.stringify(profile));
        await fetchCart();
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) logout(true);
      } finally {
        setAuthLoading(false);
      }
    };
    init();
  }, []);

  // Fetch orders for the logged-in user
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await axios.get(`${API}/orders/myorders`);
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Expected array but received:", data);
        setOrders([]); // In case of invalid response
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]); // Set empty orders on error
    } finally {
      setOrdersLoading(false);
    }
  };

  // SITE
  const fetchSiteContent = async () => {
    setSiteLoading(true);
    try {
      const { data } = await axios.get(`${API}/site-content`);
      setSiteContent(data);
      return data;
    } catch (err) {
      console.error("fetchSiteContent:", err?.response?.data || err.message);
      return null;
    } finally {
      setSiteLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const { data } = await axios.get(`${API}/products`);
      setProducts(Array.isArray(data) ? data : data.products || []);
      return data;
    } catch (err) {
      console.error("fetchProducts:", err?.response?.data || err.message);
      return [];
    } finally {
      setProductsLoading(false);
    }
  };

  // AUTH
  const login = async (email, password) => {
    try {
      const guestCart = readGuestCart();
      const { data } = await axios.post(`${API}/users/login`, {
        email,
        password,
        guestCart,
      });

      const tokenFromServer = data?.token || data?.accessToken;
      const userObj = data?.user || data;

      if (tokenFromServer) {
        setToken(tokenFromServer);
        localStorage.setItem(TOKEN_KEY, tokenFromServer);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokenFromServer}`;
      }

      if (userObj) {
        setUser(userObj);
        localStorage.setItem(USER_KEY, JSON.stringify(userObj));
      }

      await fetchCart();
      saveGuestCart([]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${API}/users/register`, {
        name,
        email,
        password,
      });
      if (data?.token) {
        setToken(data.token);
        localStorage.setItem(TOKEN_KEY, data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }
      await fetchCart();
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  };

  const logout = (silent = false) => {
    setUser(null);
    setToken("");
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete axios.defaults.headers.common["Authorization"];
    setCart(readGuestCart());
    if (!silent) console.info("[AppContext] user logged out");
  };

  // CART HELPERS
  const ensureCartItemDetails = async (item) => {
    if (item.name && item.price != null && item.image) return item;
    try {
      const res = await axios.get(`${API}/products/${item.product}`);
      const product = res.data?.product || res.data || {};
      return {
        product: item.product,
        qty: item.qty,
        name: product.name || "No Name",
        price: product.price || 0,
        image: product.images?.[0]?.url || "/placeholder.png",
      };
    } catch {
      return {
        product: item.product,
        qty: item.qty,
        name: "No Name",
        price: 0,
        image: "/placeholder.png",
      };
    }
  };

  const fetchCart = async () => {
    if (cartLoading) return; // Avoid duplicate fetches while loading
    setCartLoading(true);
    try {
      const { data } = await axios.get(`${API}/cart`);
      const detailedCart = await Promise.all(data.map(ensureCartItemDetails));
      setCart(detailedCart);
    } catch (err) {
      console.error("fetchCart:", err?.response?.data || err.message);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId, qty = 1) => {
    if (!user) {
      let guestCart = readGuestCart();
      const idx = guestCart.findIndex((i) => i.product === productId);

      let product;
      try {
        const res = await axios.get(`${API}/products/${productId}`);
        product = res.data?.product ?? res.data ?? {};
      } catch (err) {
        console.error("Product fetch failed (guest):", err);
        return { success: false, message: "Product fetch failed" };
      }

      if (idx >= 0) {
        guestCart[idx].qty += qty;
        guestCart[idx] = {
          ...guestCart[idx],
          name: product.name ?? "No Name",
          price: product.price ?? 0,
          image: product.images?.[0]?.url ?? "/placeholder.png",
        };
      } else {
        guestCart.push({
          product: productId,
          qty,
          name: product.name ?? "No Name",
          price: product.price ?? 0,
          image: product.images?.[0]?.url ?? "/placeholder.png",
        });
      }

      saveGuestCart(guestCart);
      setCart(guestCart);
      setIsCartOpen(true);
      return { success: true, guest: true, cart: guestCart };
    }

    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const { data } = await axios.post(
        `${API}/cart/add`,
        { productId, qty },
        { headers }
      );

      const detailed = Array.isArray(data)
        ? await Promise.all(data.map(ensureCartItemDetails))
        : await fetchCart();

      setCart(detailed);
      setIsCartOpen(true);
      return { success: true, cart: detailed };
    } catch (err) {
      console.error("addToCart error:", err);
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      const newGuestCart = readGuestCart().filter(
        (i) => i.product !== productId
      );
      saveGuestCart(newGuestCart);
      setCart(newGuestCart);
      return { success: true, cart: newGuestCart };
    }

    try {
      const { data } = await axios.delete(`${API}/cart/${productId}`);
      const detailed = await Promise.all(data.map(ensureCartItemDetails));
      setCart(detailed);
      return { success: true, cart: detailed };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  };

  const clearCart = async () => {
    if (!user) {
      saveGuestCart([]);
      setCart([]);
      return { success: true };
    }

    try {
      await axios.delete(`${API}/cart`);
      setCart([]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  };

  // placeOrder: posts an order and clears cart on success
  const placeOrder = async (shippingAddress, paymentMethod = "COD") => {
    if (!user) {
      return { success: false, message: "Login required" };
    }

    try {
      const body = {
        shippingAddress,
        paymentMethod,
        items: cart.map((c) => ({
          product: c.product,
          name: c.name,
          qty: c.qty,
          image: c.image,
          price: c.price,
        })),
      };

      const { data } = await axios.post(`${API}/orders`, body);

      setCart([]); // Clear cart on success
      saveGuestCart([]); // Clear guest cart

      return { success: true, order: data };
    } catch (err) {
      console.error("placeOrder:", err?.response?.data || err.message);
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  };

  // ADMIN SITE CONTENT
  const adminGetSiteContent = async () => {
    try {
      const { data } = await axios.get(`${API}/site-content`);
      setSiteContent(data);
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  };

  const adminUpdateSiteContent = async (contentData) => {
    try {
      const { data } = await axios.post(`${API}/site-content`, contentData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data?.content) setSiteContent(data.content);
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  };

  const adminDeleteBanner = async (bannerId) => {
    try {
      const { data } = await axios.delete(
        `${API}/site-content/banner/${bannerId}`
      );
      setSiteContent((s) => ({
        ...s,
        banners: s.banners.filter((b) => b._id !== bannerId),
      }));
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  };

  const value = {
    user,
    token,
    authLoading,
    login,
    logout,
    register,
    siteContent,
    siteLoading,
    fetchSiteContent,
    products,
    productsLoading,
    fetchProducts,
    cart,
    cartLoading,
    addToCart,
    fetchCart,
    removeFromCart,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    orders,
    ordersLoading,
    setOrdersLoading,
    adminGetSiteContent,
    adminUpdateSiteContent,
    adminDeleteBanner,
    placeOrder,
    fetchOrders,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
