import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getUserFromToken } from "./utils/auth";
import Sidebar from "./components/dashboard/sidebar";
import LoginPage from "./pages/auth/login/LoginPage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import ProductsPage from "./pages/products/ProductsPage";
import UsersPage from "./pages/users/UsersPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import OrdersPage from "./pages/orders/OrdersPage";
import LandingPageComponent from "./LandingPageComponent";
import PublicProductsPage from "./pages/public-products/PublicProductsPage";
import ProductDetailPage from "./pages/public-products/ProductDetailPage";
import "./App.css";

const ProtectedRoute = ({ children, role }) => {
  const user = getUserFromToken();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LandingPageComponent />} />
        <Route path="/products" element={<PublicProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute role="admin">
              <Sidebar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products-admin"
          element={
            <ProtectedRoute role="admin">
              <Sidebar />
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <Sidebar />
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute role="admin">
              <Sidebar />
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute role="admin">
              <Sidebar />
              <OrdersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
