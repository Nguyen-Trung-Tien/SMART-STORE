import OrderService from "../services/OrderService.js";
import PdfService from "../services/PdfService.js";
import path from "path";
import fs from "fs";

const createOrder = async (req, res, next) => {
  try {
    const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } = req.body;
    if (!paymentMethod || !itemsPrice || !totalPrice || !fullName || !address || !city || !phone) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await OrderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getAllOrderDetails = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await OrderService.getAllOrderDetails(userId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getDetailsOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.getOrderDetails(orderId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const cancelOrderDetails = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const data = req.body;
    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.cancelOrderDetails(orderId, data);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getAllOrder = async (req, res, next) => {
  try {
    const data = await OrderService.getAllOrder();
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const data = req.body;
    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.updateOrderStatus(orderId, data);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const downloadInvoice = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const order = await OrderService.getOrderDetails(orderId);
    if (order.status === "ERR") {
      return res.status(404).json(order);
    }

    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join('invoices', invoiceName);

    if (!fs.existsSync('invoices')) {
      fs.mkdirSync('invoices');
    }

    await PdfService.generateInvoice(order.data, invoicePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${invoiceName}`);
    
    const fileStream = fs.createReadStream(invoicePath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      // Optionally delete the file after sending
      // fs.unlinkSync(invoicePath);
    });
  } catch (e) {
    next(e);
  }
};

export default {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  cancelOrderDetails,
  getAllOrder,
  updateOrderStatus,
  downloadInvoice,
};
