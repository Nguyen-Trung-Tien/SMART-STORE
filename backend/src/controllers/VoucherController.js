import VoucherService from "../services/VoucherService.js";

const applyVoucher = async (req, res, next) => {
  try {
    const { code, orderValue } = req.body;
    if (!code || orderValue === undefined) {
      return res.status(400).json({
        status: "ERR",
        message: "The code and orderValue are required",
      });
    }

    const response = await VoucherService.applyVoucher(code, orderValue);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const createVoucher = async (req, res, next) => {
  try {
    const response = await VoucherService.createVoucher(req.body);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const updateVoucher = async (req, res, next) => {
  try {
    const voucherId = req.params.id;
    if (!voucherId) {
      return res.status(400).json({
        status: "ERR",
        message: "The voucherId is required",
      });
    }
    const response = await VoucherService.updateVoucher(voucherId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteVoucher = async (req, res, next) => {
  try {
    const voucherId = req.params.id;
    if (!voucherId) {
      return res.status(400).json({
        status: "ERR",
        message: "The voucherId is required",
      });
    }
    const response = await VoucherService.deleteVoucher(voucherId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getAllVouchers = async (req, res, next) => {
  try {
    const response = await VoucherService.getAllVouchers(req.query);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getVoucherById = async (req, res, next) => {
  try {
    const voucherId = req.params.id;
    if (!voucherId) {
      return res.status(400).json({
        status: "ERR",
        message: "The voucherId is required",
      });
    }
    const response = await VoucherService.getVoucherById(voucherId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

export default {
  applyVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getAllVouchers,
  getVoucherById,
};
