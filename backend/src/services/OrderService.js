import Order from "../models/OrderProduct.js";
import Product from "../models/ProductModel.js";
import Cart from "../models/CartModel.js";
import EmailService from "./EmailService.js";

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
      isPaid,
      paidAt,
      email,
      discountPrice,
      couponCode,
    } = newOrder;
    try {
      const promises = orderItems.map(async (order) => {
        const amount = Number(order.amount || order.quantity || 0);
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: amount },
          },
          {
            $inc: {
              countInStock: -amount,
              selled: +amount,
            },
          },
          { new: true }
        );
        if (productData) {
          return {
            status: "OK",
            message: "SUCCESS",
          };
        } else {
          return {
            status: "ERR",
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
          message: `San pham voi id: ${arrId.join(",")} khong du hang`,
        });
      } else {
        const createdOrder = await Order.create({
          orderItems: orderItems.map(item => ({
            ...item,
            product: item.product || item._id,
            amount: Number(item.amount || item.quantity || 0)
          })),
          shippingAddress: {
            fullName,
            address,
            city,
            phone,
          },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user: user,
          isPaid,
          paidAt,
          discountPrice,
          couponCode,
        });
        if (createdOrder) {
          // Clear cart after successful order
          await Cart.findOneAndUpdate({ user: user }, { cartItems: [] });
          
          await EmailService.sendEmailCreateOrder(email, orderItems);
          resolve({
            status: "OK",
            message: "success",
            data: createdOrder
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
      const order = await Order.find({
        user: id,
      }).sort({ createdAt: -1, updatedAt: -1 });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESS",
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
        const amount = Number(order.amount || order.quantity || 0);
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            selled: { $gte: amount },
          },
          {
            $inc: {
              countInStock: +amount,
              selled: -amount,
            },
          },
          { new: true }
        );
        if (productData) {
          order = await Order.findByIdAndDelete(id);
          if (order === null) {
            resolve({
              status: "ERR",
              message: "The order is not defined",
            });
          }
        } else {
          return {
            status: "ERR",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => !!item);
      if (newData.length) {
        resolve({
          status: "ERR",
          message: `San pham voi id: ${newData[0].id} khong ton tai`,
        });
      }
      resolve({
        status: "OK",
        message: "success",
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
      const allOrder = await Order.find().sort({ createdAt: -1, updatedAt: -1 });
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

const updateOrderStatus = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true });
      if (updatedOrder === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  createOrder,
  getAllOrderDetails,
  getOrderDetails,
  cancelOrderDetails,
  getAllOrder,
  updateOrderStatus,
};
