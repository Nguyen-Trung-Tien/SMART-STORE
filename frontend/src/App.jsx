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
import MyOrdersPage from "./pages/ProfilePage/MyOrdersPage";
import { AdminLayout } from "./components/layout/AdminLayout";
import DashboardPage from "./pages/Admin/Dashboard/DashboardPage";
import AdminProductsPage from "./pages/Admin/Products/AdminProductsPage";
import RolesList from "./pages/Admin/Roles/RolesList";
import OrdersList from "./pages/Admin/Orders/OrdersList";
import CustomersList from "./pages/Admin/Customers/CustomersList";

function App() {
  useEffect(() => {
    try {
      const auth = localStorage.getItem("auth-storage");
      const cart = localStorage.getItem("cart-storage");
      if (auth && auth.length > 2 * 1024 * 1024) {
        console.warn("Auth storage is bloated, clearing avatar...");
        const parsed = JSON.parse(auth);
        if (parsed.state?.user?.avatar?.startsWith("data:image")) {
          parsed.state.user.avatar = null;
          localStorage.setItem("auth-storage", JSON.stringify(parsed));
        }
      }
      if (cart && cart.length > 2 * 1024 * 1024) {
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
          <Route path="my-orders" element={<MyOrdersPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          
          {/* Catalog */}
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<div className="p-6"><h2 className="text-2xl font-bold">Categories Management</h2><p className="text-muted-foreground mt-2">Manage nested categories and structure.</p></div>} />
          <Route path="inventory" element={<div className="p-6"><h2 className="text-2xl font-bold">Inventory Management</h2><p className="text-muted-foreground mt-2">Track stock levels and warehouses.</p></div>} />
          
          {/* Sales */}
          <Route path="orders" element={<OrdersList />} />
          <Route path="payments" element={<div className="p-6"><h2 className="text-2xl font-bold">Payments & Finance</h2><p className="text-muted-foreground mt-2">Track transactions, refunds, and revenue.</p></div>} />
          <Route path="promotions" element={<div className="p-6"><h2 className="text-2xl font-bold">Coupons & Promotions</h2><p className="text-muted-foreground mt-2">Create discount codes and campaigns.</p></div>} />

          {/* Customers */}
          <Route path="customers" element={<CustomersList />} />
          <Route path="reviews" element={<div className="p-6"><h2 className="text-2xl font-bold">Reviews Management</h2><p className="text-muted-foreground mt-2">Moderate product reviews.</p></div>} />

          {/* System */}
          <Route path="content" element={<div className="p-6"><h2 className="text-2xl font-bold">Content Management</h2><p className="text-muted-foreground mt-2">Manage banners, FAQ, and pages.</p></div>} />
          <Route path="notifications" element={<div className="p-6"><h2 className="text-2xl font-bold">Notifications</h2><p className="text-muted-foreground mt-2">Manage email and push notifications.</p></div>} />
          <Route path="roles" element={<RolesList />} />
          <Route path="settings" element={<div className="p-6"><h2 className="text-2xl font-bold">System Settings</h2><p className="text-muted-foreground mt-2">Configure store settings, payment gateways, etc.</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
