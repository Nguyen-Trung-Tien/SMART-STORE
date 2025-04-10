const Order = require("../models/OrderProduct");
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
    } = newOrder;
    try {
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
        resolve({
          status: "OK",
          message: "Success",
          data: createUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
};
