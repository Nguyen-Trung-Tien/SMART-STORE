const express = require("express");
const router = express.Router();
const SliderController = require("../controllers/SliderController");

router.post("/create-slider", SliderController.createSlider);

module.exports = router;
