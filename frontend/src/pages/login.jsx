import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppContext from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";

const Login = () => {
  const { login } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result.success) {
      const storedUser = JSON.parse(localStorage.getItem("user_v1"));
      if (storedUser?.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      alert(result.message || "Login failed. Please try again.");
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
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm mt-1">Login to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
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

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-orange-500 font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
