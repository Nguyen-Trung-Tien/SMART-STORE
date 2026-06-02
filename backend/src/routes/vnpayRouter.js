import express from "express";
import moment from "moment";
import crypto from "crypto";
import qs from "qs";
import Order from "../models/OrderModel.js";

const router = express.Router();

router.post("/create_payment_url", function (req, res, next) {
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  var tmnCode = process.env.VNP_TMN_CODE;
  var secretKey = process.env.VNP_HASH_SECRET;
  var vnpUrl = process.env.VNP_URL;
  var returnUrl = process.env.VNP_RETURN_URL;

  var date = new Date();
  var createDate = moment(date).format("YYYYMMDDHHmmss");
  var orderId = req.body.orderId || moment(date).format("HHmmss");
  var amount = req.body.amount;
  var bankCode = req.body.bankCode;

  var orderInfo = req.body.orderDescription;
  var orderType = req.body.orderType;
  var locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var signData = qs.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });

  res.status(200).json({ code: "00", data: vnpUrl });
});

router.post("/verify", async (req, res) => {
  try {
    const vnp_Params = req.body;
    const secureHash = vnp_Params["vnp_SecureHash"];
    
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    
    const sortedParams = sortObject(vnp_Params);
    const secretKey = process.env.VNP_HASH_SECRET;
    
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    
    if (secureHash === signed) {
      const orderId = vnp_Params["vnp_TxnRef"] || vnp_Params["vnp_OrderInfo"];
      const responseCode = vnp_Params["vnp_ResponseCode"];
      
      if (responseCode === "00") {
        const order = await Order.findById(orderId);
        if (order) {
          order.isPaid = true;
          order.paidAt = new Date();
          order.paymentStatus = "paid";
          order.status = "Paid";
          await order.save();
          return res.status(200).json({ status: "OK", message: "Success" });
        } else {
          return res.status(404).json({ status: "ERR", message: "Order not found" });
        }
      }
      return res.status(400).json({ status: "ERR", message: "Payment failed response code" });
    } else {
      return res.status(400).json({ status: "ERR", message: "Invalid signature" });
    }
  } catch (e) {
    return res.status(500).json({ status: "ERR", message: e.message });
  }
});


function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export default router;
