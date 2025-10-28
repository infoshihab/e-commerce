import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { AppProvider } from "./context/AppContext";
import Cart from "./components/cart";

import AdminDashboard from "./components/dashboardAdmin";
import ProductListAdmin from "./components/productListAdmin";
import ProductDetails from "./components/productDetails";
import SiteContentAdmin from "./components/siteContentAdmin";
import AdminOrderDashboard from "./components/adminOrderDashboard";
import CategoryAdmin from "./components/categoryAdmin";
import FrontendLayout from "./pages/FrontendLayout";
import CategoryProduct from "./components/categoryProducts";
import OrderList from "./components/orderList";
import About from "./components/about";
import Policy from "./components/policy";
import AdminDashboards from "./pages/AdminDashboard";

function App() {
  return (
    <AppProvider>
      <Cart />
      <Routes>
        {/* Frontend Pages */}
        <Route
          path="/"
          element={
            <FrontendLayout>
              <Home />
            </FrontendLayout>
          }
        />
        <Route
          path="/products/:id"
          element={
            <FrontendLayout>
              <ProductDetails />
            </FrontendLayout>
          }
        />
        <Route
          path="/category/:categoryId"
          element={
            <FrontendLayout>
              <CategoryProduct />
            </FrontendLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <FrontendLayout>
              <OrderList />
            </FrontendLayout>
          }
        />
        <Route
          path="/about"
          element={
            <FrontendLayout>
              <About />
            </FrontendLayout>
          }
        />
        <Route
          path="/return-policy"
          element={
            <FrontendLayout>
              <Policy />
            </FrontendLayout>
          }
        />
        <Route
          path="/login"
          element={
            <FrontendLayout>
              <Login />
            </FrontendLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <FrontendLayout>
              <Signup />
            </FrontendLayout>
          }
        />

        {/* Admin Pages */}
        <Route path="admin/*" element={<AdminDashboards />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductListAdmin />} />
          <Route path="orders" element={<AdminOrderDashboard />} />
          <Route path="categories" element={<CategoryAdmin />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}

export default App;
