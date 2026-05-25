import Order from "../models/OrderProduct.js";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import moment from "moment";

const getDashboardStats = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalRevenue = await Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ]);

      const totalUsers = await User.countDocuments();
      const totalOrders = await Order.countDocuments();
      const lowStockProducts = await Product.find({ countInStock: { $lte: 10 } });

      // Revenue by month (last 12 months)
      const revenueByMonth = await Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            revenue: { $sum: "$totalPrice" }
          }
        },
        { $sort: { "_id": 1 } }
      ]);

      // New users by month
      const newUsersByMonth = await User.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]);

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: {
          totalRevenue: totalRevenue[0]?.total || 0,
          totalUsers,
          totalOrders,
          lowStockCount: lowStockProducts.length,
          lowStockProducts,
          revenueByMonth,
          newUsersByMonth,
          conversionRate: totalUsers > 0 ? (totalOrders / totalUsers).toFixed(2) : 0
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getDashboardStats,
};