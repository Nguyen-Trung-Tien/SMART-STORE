import Voucher from "../models/VoucherModel.js";

const applyVoucher = (code, orderValue) => {
  return new Promise(async (resolve, reject) => {
    try {
      const voucher = await Voucher.findOne({ code, isActive: true });
      if (!voucher) {
        return resolve({
          status: "ERR",
          message: "Voucher not found or inactive",
        });
      }

      if (new Date() < new Date(voucher.startDate) || new Date() > new Date(voucher.endDate)) {
        return resolve({
          status: "ERR",
          message: "Voucher is expired or not started yet",
        });
      }

      if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
        return resolve({
          status: "ERR",
          message: "Voucher usage limit reached",
        });
      }

      if (orderValue < voucher.minOrderValue) {
        return resolve({
          status: "ERR",
          message: `Minimum order value is ${voucher.minOrderValue}`,
        });
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

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: {
          ...voucher.toObject(),
          discountAmount,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

const createVoucher = (newVoucher) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existing = await Voucher.findOne({ code: newVoucher.code });
      if (existing) {
        return resolve({
          status: "ERR",
          message: "Voucher code already exists",
        });
      }
      const created = await Voucher.create(newVoucher);
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: created,
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  applyVoucher,
  createVoucher
};
