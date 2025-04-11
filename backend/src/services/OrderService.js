const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
    } = newOrder;
    try {
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          { $inc: { countInStock: -order.amount, selling: +order.amount } },
          { new: true }
        );
        if (productData) {
          const createOrder = await Order.create({
            orderItems,
            shippingAddress: { fullName, address, city, phone },
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user: user,
          });
          if (createOrder) {
            return {
              status: "OK",
              message: "SUCCESS",
            };
          }
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.id);
      if (newData.length) {
        resolve({
          status: "ERR",
          message: `San pham voi id  ${newData.join(",")} da khong du hang`,
          data: newData,
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
      console.log("results", results);
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findOne({ user: id });
      if (order === null) {
        resolve({ status: "OK", message: "The order is not defined" });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
  getDetailsOrder,
};
