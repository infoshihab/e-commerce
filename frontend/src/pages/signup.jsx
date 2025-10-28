import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";

const Signup = () => {
  const { register } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const result = await register(name, email, password);

    if (result.success) {
      alert("Signup successful! Please log in.");
      navigate("/login");
    } else {
      alert(result.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={assets.logo}
            alt="Logo"
            className="h-16 mb-2 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sign up to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-orange-500 font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
