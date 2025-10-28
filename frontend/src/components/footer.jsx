import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets.js";

const Footer = () => {
  return (
    <footer className="bg-[#fc8934] text-gray-800 py-16">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Footer Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div className="space-y-8">
            <img src={assets.logo} alt="Logo" className="h-16 w-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Ghorer Bazar: Your Trusted Source for Safe & Organic Food
            </h2>
            {/* <p className="hidden md:block text-sm md:text-base text-gray-200 leading-relaxed">
              Ghorer Bazar is a leading e-commerce platform committed to
              delivering safe, healthy, and organic food products across
              Bangladesh. Renowned for its dedication to quality, Ghorer Bazar
              offers a diverse range of health-focused items, including premium
              mustard oil, pure ghee, organic honey, dates, chia seeds, and an
              assortment of nuts. Each product is carefully sourced and crafted
              to ensure maximum health benefits, meeting the highest standards
              of purity and freshness.
            </p> */}
          </div>

          {/* Footer Links */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-white">Quick Links</h3>
            <ul className="text-white space-y-4">
              <li>
                <Link
                  to="/about"
                  className="hover:text-orange-200 transition-all duration-300 ease-in-out"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/return-policy"
                  className="hover:text-orange-200 transition-all duration-300 ease-in-out"
                >
                  রিটার্ন পলিসি
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="hover:text-orange-200 transition-all duration-300 ease-in-out"
                >
                  রিফান্ড পলিসি
                </Link>
              </li>
              <li>
                <Link
                  to="/customer-service"
                  className="hover:text-orange-200 transition-all duration-300 ease-in-out"
                >
                  গ্রাহক সেবা
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-orange-200 transition-all duration-300 ease-in-out"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-white">Contact Info</h3>
            <div className="space-y-4 text-white">
              <p className="text-sm">
                <strong>Email:</strong> contact@ghorerbazar.com
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> +8801234567890
              </p>
              <p className="text-sm">
                <strong>DBID ID:</strong> 437361334
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-300 pt-8">
          <p className="text-center text-white text-sm">
            © 2024 ঘরের বাজার. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
