import React, { useState, useEffect } from "react";
import { FaRegUser, FaBars } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { MdOutlineShoppingBag } from "react-icons/md";
import { assets } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { openCart, cart, user, logout } = useAppContext();
  const API = import.meta.env.VITE_BACKEND_URL || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API}/categories`);
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, [API]);

  const handleCategoryClick = (catId) => {
    navigate(`/category/${catId}`);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full shadow-md bg-white relative z-40">
      {/* Top Navbar */}
      <nav className="px-4 sm:px-6 lg:px-2 py-3 flex items-center justify-between lg:justify-evenly h-20">
        {/* Left: Search */}
        <div className="flex items-center space-x-3 pl-4 lg:pl-8">
          <button
            onClick={() => setSearchOpen((prev) => !prev)}
            className="text-orange-500 hover:text-orange-600 transition-colors"
          >
            <GoSearch size={22} />
          </button>
        </div>

        {/* Middle: Logo */}
        <div
          className="flex justify-center items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={assets.logo}
            alt="Logo"
            className="h-16 sm:h-14 object-contain"
          />
        </div>

        {/* Right: Cart & User */}
        <div className="hidden md:flex items-center space-x-6 pr-4 lg:pr-8">
          {/* User Dropdown */}
          <div className="relative">
            <button
              className="text-orange-500 hover:text-orange-600 flex items-center gap-1"
              onClick={() => setUserMenuOpen((prev) => !prev)}
            >
              <FaRegUser size={22} />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-3 bg-white border border-gray-200 rounded-lg shadow-lg w-48 py-2 z-50">
                {!user ? (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/signup")}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/orders")}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100"
                    >
                      Orders
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={openCart}
            className="text-orange-500 hover:text-orange-600 relative transition-colors"
          >
            <MdOutlineShoppingBag size={24} />
            {cart?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Hamburger menu for medium/small screens */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen((prev) => !prev)}>
            <FaBars size={25} className="text-orange-500" />
          </button>
        </div>
      </nav>

      {/* Categories bar: visible on large and medium screens */}
      <div className="hidden lg:flex md:flex justify-center bg-gray-100 py-4 border-t border-gray-200">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategoryClick(cat._id)}
            className="mx-6 text-lg text-gray-700 hover:text-gray-900 font-medium relative"
          >
            {cat.name}
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-orange-500 transition-all duration-300 hover:w-full"></span>
          </button>
        ))}
      </div>

      {/* Mobile / Medium menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-100 border-t border-gray-200 px-4 py-3">
          {/* Categories */}
          <div className="flex flex-col gap-2 mb-3">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryClick(cat._id)}
                className="text-lg sm:text-xl text-gray-700 py-2 px-3 hover:bg-gray-200 rounded"
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* User options */}
          <div className="flex flex-col gap-2 border-t border-gray-300 pt-3">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-700 py-2 px-3 hover:bg-gray-200 rounded"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="text-gray-700 py-2 px-3 hover:bg-gray-200 rounded"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/orders")}
                  className="text-gray-700 py-2 px-3 hover:bg-gray-200 rounded"
                >
                  Orders
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 py-2 px-3 hover:bg-gray-200 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Optional: search input overlay for mobile */}
      {searchOpen && (
        <div className="absolute top-20 left-0 w-full px-4 py-3 bg-white shadow-md md:hidden">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border border-orange-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      )}
    </header>
  );
};

export default Navbar;
