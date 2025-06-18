const express = require("express");
const router = express.Router();
const qs = require("qs");
const crypto = require("crypto");
const moment = require("moment");
const dotenv = require("dotenv");
dotenv.config();

router.post("/create_payment_url", (req, res) => {
  const { amount, orderDescription } = req.body;
  const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: process.env.VNP_TMNCODE,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: moment().format("HHmmss"),
    vnp_OrderInfo: orderDescription,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: process.env.VNP_RETURNURL,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: moment().format("YYYYMMDDHHmmss"),
  };

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  sortedParams["vnp_SecureHash"] = signed;

  const paymentUrl =
    process.env.VNP_URL + "?" + qs.stringify(sortedParams, { encode: false });
  res.status(200).json({ paymentUrl });
});

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

module.exports = router;
