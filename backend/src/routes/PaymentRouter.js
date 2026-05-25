import express from "express";

const router = express.Router();

router.get("/config", (req, res) => {
  return res.status(200).json({
    status: "OK",
    data: process.env.PAYPAL_CLIENT_ID,
  });
});

export default router;
