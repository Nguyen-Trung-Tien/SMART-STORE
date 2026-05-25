import UserRouter from "./UserRouter.js";
import ProductRouter from "./ProductRouter.js";
import OrderRouter from "./OrderRouter.js";
import PaymentRouter from "./PaymentRouter.js";
import vnpayRouter from "./vnpayRouter.js";

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/payment", PaymentRouter);
  app.use("/api/vnpay", vnpayRouter);
};

export default routes;
