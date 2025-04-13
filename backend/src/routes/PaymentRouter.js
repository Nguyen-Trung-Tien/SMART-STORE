const express = require("express");
const router = express.Router();
// const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
router.get("/config", (req, res) => {
  return res.status(200).json({
    status: "OK",
    data: process.env.CLIENT_ID,
  });
});

// VNPay payment route
// router.post("/vnpay_payment", (req, res) => {
//   const { amount, orderInfo, returnUrl } = req.body;

//   if (!amount || !orderInfo || !returnUrl) {
//     return res
//       .status(400)
//       .json({ status: "FAILED", message: "Missing required fields" });
//   }

//   const vnpUrl = process.env.VNP_URL;
//   const vnpTmnCode = process.env.VNP_TMNCODE;
//   const vnpHashSecret = process.env.VNP_HASHSECRET;

//   const date = new Date();
//   const createDate = `${date.getFullYear()}${(date.getMonth() + 1)
//     .toString()
//     .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${date
//     .getHours()
//     .toString()
//     .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
//     .getSeconds()
//     .toString()
//     .padStart(2, "0")}`;

//   const orderId = crypto.randomBytes(8).toString("hex");

//   let vnpParams = {
//     vnp_Version: "2.1.0",
//     vnp_Command: "pay",
//     vnp_TmnCode: vnpTmnCode,
//     vnp_Amount: amount * 100, // Convert to VND
//     vnp_CurrCode: "VND",
//     vnp_TxnRef: orderId,
//     vnp_OrderInfo: orderInfo,
//     vnp_OrderType: "other",
//     vnp_Locale: "vn",
//     vnp_ReturnUrl: returnUrl,
//     vnp_CreateDate: createDate,
//     vnp_IpAddr: req.ip,
//   };

//   // Sort parameters alphabetically
//   vnpParams = Object.keys(vnpParams)
//     .sort()
//     .reduce((acc, key) => {
//       acc[key] = vnpParams[key];
//       return acc;
//     }, {});

//   const querystring = require("querystring");
//   const signData = querystring.stringify(vnpParams) + `&${vnpHashSecret}`;
//   const secureHash = crypto
//     .createHmac("sha512", vnpHashSecret)
//     .update(signData)
//     .digest("hex");

//   vnpParams["vnp_SecureHash"] = secureHash;
//   const paymentUrl = `${vnpUrl}?${querystring.stringify(vnpParams)}`;

//   return res.status(200).json({ status: "OK", paymentUrl });
// });
module.exports = router;
