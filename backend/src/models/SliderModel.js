const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    name: { type: String },
    title: { type: String },
    description: { type: String },
    images: { type: String },
    link: { type: String },
  },
  {
    timestamps: true,
  }
);

const Slider = mongoose.model("Slider", sliderSchema);

module.exports = Slider;
