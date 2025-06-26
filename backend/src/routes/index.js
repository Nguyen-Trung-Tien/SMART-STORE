const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./OrderRouter");
const PaymentRouter = require("./PaymentRouter");
const vnpayRouter = require("./vnpayRouter");
const SliderRouter = require("./SliderRouter");
const CartRouter = require("./CartRoutes");
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/payment", PaymentRouter);
  app.use("/api/vnpay", vnpayRouter);
  app.use("/api/slider", SliderRouter);
  app.use("/api/cart", CartRouter);
};
module.exports = routes;
