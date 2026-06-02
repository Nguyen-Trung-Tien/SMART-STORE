import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { RouteErrorFallback } from "@/components/feedback/RouteErrorFallback";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { AdminRoute } from "@/router/AdminRoute";
import { GuestRoute } from "@/router/GuestRoute";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";

const HomePage = lazy(() => import("@/pages/Home"));
const ProductsPage = lazy(() => import("@/pages/Product"));
const ProductDetailPage = lazy(() => import("@/pages/Product/Detail"));
const CartPage = lazy(() => import("@/pages/Cart"));
const CheckoutPage = lazy(() => import("@/pages/Checkout"));
const OrdersPage = lazy(() => import("@/pages/Order"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const LoginPage = lazy(() => import("@/pages/Auth/Login"));
const RegisterPage = lazy(() => import("@/pages/Auth/Register"));
const AdminDashboardPage = lazy(() => import("@/pages/Admin/Dashboard"));
const AdminProductsPage = lazy(() => import("@/pages/Admin/Products"));
const ProductCreatePage = lazy(() => import("@/pages/Admin/Product/ProductCreatePage"));
const ProductEditPage = lazy(() => import("@/pages/Admin/Product/ProductEditPage"));
const AdminOrdersPage = lazy(() => import("@/pages/Admin/Orders"));
const AdminUsersPage = lazy(() => import("@/pages/Admin/Users"));
const WishlistPage = lazy(() => import("@/pages/Wishlist"));
const VnpayReturnPage = lazy(() => import("@/pages/Checkout/VnpayReturn"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

function RouteSuspense() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading page..." />}>
      <Outlet />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <RouteSuspense />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "products", element: <ProductsPage /> },
          { path: "product/:slug", element: <ProductDetailPage /> },
          { path: "cart", element: <CartPage /> },
        ],
      },
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: "login", element: <LoginPage /> },
              { path: "register", element: <RegisterPage /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { path: "checkout", element: <CheckoutPage /> },
              { path: "checkout/vnpay-return", element: <VnpayReturnPage /> },
              { path: "orders", element: <OrdersPage /> },
              { path: "profile", element: <ProfilePage /> },
              { path: "wishlist", element: <WishlistPage /> },
            ],
          },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                element: <DashboardLayout />,
                children: [
                  { path: "admin", element: <AdminDashboardPage /> },
                  { path: "admin/dashboard", element: <AdminDashboardPage /> },
                  { path: "admin/products", element: <AdminProductsPage /> },
                  { path: "admin/products/create", element: <ProductCreatePage /> },
                  { path: "admin/products/:id/edit", element: <ProductEditPage /> },
                  { path: "admin/orders", element: <AdminOrdersPage /> },
                  { path: "admin/users", element: <AdminUsersPage /> },
                ],
              },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
