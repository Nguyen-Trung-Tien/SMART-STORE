import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import CartPage from "./pages/CartPage/CartPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccess/OrderSuccessPage";
import { AdminLayout } from "./components/layout/AdminLayout";
import DashboardPage from "./pages/Admin/Dashboard/DashboardPage";
import AdminProductsPage from "./pages/Admin/Products/AdminProductsPage";

function App() {
  useEffect(() => {
    // Cleanup bloated legacy storage if needed
    try {
      const auth = localStorage.getItem("auth-storage");
      const cart = localStorage.getItem("cart-storage");
      if (auth && auth.length > 2 * 1024 * 1024) { // > 2MB
        console.warn("Auth storage is bloated, clearing avatar...");
        const parsed = JSON.parse(auth);
        if (parsed.state?.user?.avatar?.startsWith("data:image")) {
          parsed.state.user.avatar = null;
          localStorage.setItem("auth-storage", JSON.stringify(parsed));
        }
      }
      if (cart && cart.length > 2 * 1024 * 1024) { // > 2MB
        console.warn("Cart storage is bloated, clearing images...");
        const parsed = JSON.parse(cart);
        if (parsed.state?.cartItems) {
          parsed.state.cartItems = parsed.state.cartItems.map(item => ({
            ...item,
            image: item.image?.startsWith("data:image") ? null : item.image
          }));
          localStorage.setItem("cart-storage", JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.error("Storage cleanup failed", e);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product-details/:id" element={<ProductDetailsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="users" element={<div>Quản lý người dùng (Đang phát triển)</div>} />
          <Route path="vouchers" element={<div>Quản lý voucher (Đang phát triển)</div>} />
          <Route path="support" element={<div>Hỗ trợ trực tuyến (Đang phát triển)</div>} />
          <Route path="settings" element={<div>Cài đặt (Đang phát triển)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
