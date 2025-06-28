const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./OrderRouter");
const PaymentRouter = require("./PaymentRouter");
const vnpayRouter = require("./vnpayRouter");
const routes = (app) => {
  app.use("/api/v1/user", UserRouter);
  app.use("/api/v1/product", ProductRouter);
  app.use("/api/v1/order", OrderRouter);
  app.use("/api/v1/payment", PaymentRouter);
  app.use("/api/v1/vnpay", vnpayRouter);
};
module.exports = routes;
