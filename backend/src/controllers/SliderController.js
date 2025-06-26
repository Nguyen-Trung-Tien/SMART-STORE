const SliderService = require("../services/SliderService");

const createSlider = async (req, res) => {
  try {
    const response = await SliderService.createSlider(req.body);
    return res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      message: e,
      status: " Not create Slider!",
    });
  }
};

module.exports = {
  createSlider,
};
