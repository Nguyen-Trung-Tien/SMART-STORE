import UserRouter from "./UserRouter.js";
import ProductRouter from "./ProductRouter.js";
import OrderRouter from "./OrderRouter.js";
import PaymentRouter from "./PaymentRouter.js";
import vnpayRouter from "./vnpayRouter.js";
import CartRouter from "./CartRouter.js";
import AnalyticsRouter from "./AnalyticsRouter.js";
import WishlistRouter from "./WishlistRouter.js";
import VoucherRouter from "./VoucherRouter.js";
import ReviewRouter from "./ReviewRouter.js";

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/payment", PaymentRouter);
  app.use("/api/vnpay", vnpayRouter);
  app.use("/api/cart", CartRouter);
  app.use("/api/analytics", AnalyticsRouter);
  app.use("/api/wishlist", WishlistRouter);
  app.use("/api/voucher", VoucherRouter);
  app.use("/api/review", ReviewRouter);
};

export default routes;
