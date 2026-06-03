import Voucher from "../models/VoucherModel.js";

const buildResponse = (data, message = "SUCCESS", extra = {}) => ({
  status: "OK",
  message,
  ...extra,
  data,
});

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const applyVoucher = async (code, orderValue) => {
  const voucher = await Voucher.findOne({ code, isActive: true });
  if (!voucher) {
    return {
      status: "ERR",
      message: "Voucher not found or inactive",
    };
  }

  if (new Date() < new Date(voucher.startDate) || new Date() > new Date(voucher.endDate)) {
    return {
      status: "ERR",
      message: "Voucher is expired or not started yet",
    };
  }

  if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
    return {
      status: "ERR",
      message: "Voucher usage limit reached",
    };
  }

  if (orderValue < voucher.minOrderValue) {
    return {
      status: "ERR",
      message: `Minimum order value is ${voucher.minOrderValue}`,
    };
  }

  let discountAmount = 0;
  if (voucher.type === 'percentage') {
    discountAmount = (orderValue * voucher.value) / 100;
    if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
      discountAmount = voucher.maxDiscount;
    }
  } else if (voucher.type === 'fixed' || voucher.type === 'shipping') {
    discountAmount = voucher.value;
  }

  return buildResponse({
    ...voucher.toObject(),
    discountAmount,
  });
};

const createVoucher = async (newVoucher) => {
  const existing = await Voucher.findOne({ code: newVoucher.code });
  if (existing) {
    throw createHttpError(400, "Voucher code already exists");
  }
  const created = await Voucher.create(newVoucher);
  return buildResponse(created, "Voucher created successfully");
};

const updateVoucher = async (id, data) => {
  const updated = await Voucher.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!updated) {
    throw createHttpError(404, "Voucher not found");
  }
  return buildResponse(updated, "Voucher updated successfully");
};

const deleteVoucher = async (id) => {
  const deleted = await Voucher.findByIdAndDelete(id);
  if (!deleted) {
    throw createHttpError(404, "Voucher not found");
  }
  return buildResponse(null, "Voucher deleted successfully");
};

const getAllVouchers = async (query = {}) => {
  const vouchers = await Voucher.find(query).sort({ createdAt: -1 });
  return buildResponse(vouchers);
};

const getVoucherById = async (id) => {
  const voucher = await Voucher.findById(id);
  if (!voucher) {
    throw createHttpError(404, "Voucher not found");
  }
  return buildResponse(voucher);
};

export default {
  applyVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getAllVouchers,
  getVoucherById,
};
