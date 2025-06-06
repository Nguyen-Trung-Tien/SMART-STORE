const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");

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
      paidAt,
      isPaid,
      email,
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
          return {
            status: "OK",
            message: "SUCCESS",
          };
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
        const arrId = [];
        newData.forEach((item) => {
          arrId.push(item.id);
        });
        resolve({
          status: "ERR",
          message: `Hang voi id  ${arrId.join(",")} da het hang`,
        });
      } else {
        const createOrder = await Order.create({
          orderItems,
          shippingAddress: { fullName, address, city, phone },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user: user,
          paidAt,
          isPaid,
        });
        if (createOrder) {
          await EmailService.sendEmailCreateOrder(email, orderItems);
          resolve({
            status: "OK",
            message: "SUCCESS",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({ user: id });
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
const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({ _id: id });
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

const cancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      const promises = data.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            selling: { $gte: order.amount },
          },
          { $inc: { countInStock: +order.amount, selling: -order.amount } },
          { new: true }
        );
        if (productData) {
          order = await Order.findByIdAndDelete(id);
          if (order === null) {
            resolve({ status: "ERR", message: "The order is not defined" });
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
      const newData = results && results.filter((item) => item);
      if (newData.length) {
        resolve({
          status: "ERR",
          message: `Hang voi id  ${newData.join(",")} khong ton tai`,
        });
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

const confirmOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(id);
      if (!order) {
        return resolve({
          status: "ERR",
          message: "The order is not found",
        });
      }

      if (order.status === "confirmed") {
        return resolve({
          status: "ERR",
          message: "The order has already been confirmed",
        });
      }

      order.status = "confirmed";
      await order.save();

      resolve({
        status: "OK",
        message: "Order confirmed successfully",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find();
      resolve({
        status: "OK",
        message: "Success",
        data: allOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateOrderPaid = async (id) => {
  try {
    const order = await Order.findById(id);
    if (!order) {
      return {
        status: "ERR",
        message: "Không tìm thấy đơn hàng",
      };
    }

    order.isPaid = true;
    order.paidAt = new Date();

    const updatedOrder = await order.save();
    return {
      status: "OK",
      message: "Đã cập nhật trạng thái thanh toán",
      data: updatedOrder,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message || "Có lỗi xảy ra khi cập nhật thanh toán",
    };
  }
};

const updateOrderDelivered = async (id) => {
  try {
    const order = await Order.findById(id);
    if (!order) {
      return {
        status: "ERR",
        message: "Không tìm thấy đơn hàng",
      };
    }
    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();
    return {
      status: "OK",
      message: "Đã cập nhật trạng thái giao hàng",
      data: updatedOrder,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message || "Có lỗi xảy ra khi cập nhật giao hàng",
    };
  }
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  cancelOrderDetails,
  getAllOrder,
  confirmOrderDetails,
  updateOrderDelivered,
  updateOrderPaid,
};
