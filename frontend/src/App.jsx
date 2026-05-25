import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { AdminLayout } from "./components/layout/AdminLayout";
import DashboardPage from "./pages/Admin/Dashboard/DashboardPage";
import AdminProductsPage from "./pages/Admin/Products/AdminProductsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<div className="container mx-auto py-10 px-4 text-center"><h1 className="text-3xl font-bold">Danh sách Sản phẩm (Đang phát triển)</h1></div>} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
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
