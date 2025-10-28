import React, { useState } from "react";
import AdminSidebar from "../components/adminslidebar"; // Ensure correct path
import DashboardAdmin from "../components/dashboardAdmin";
import ProductListAdmin from "../components/productListAdmin";
import SiteContentAdmin from "../components/siteContentAdmin";
import AdminOrderDashboard from "../components/adminOrderDashboard";
import CategoryAdmin from "../components/categoryAdmin";
import { Outlet } from "react-router-dom"; // This will render nested routes

const AdminDashboards = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar setActiveSection={setActiveSection} />

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 ml-64">
        {/* This Outlet will render nested routes (e.g., ProductListAdmin, AdminOrderDashboard) */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboards;
