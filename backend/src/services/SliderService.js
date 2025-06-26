const Slider = require("../models/SliderModel");

const createSlider = async (newSlider) => {
  return new Promise(async (resolve, reject) => {
    const { name, title, description, link } = newSlider;
    try {
      const newSlider = await Slider.create({
        name,
        title,
        description,
        link,
      });
      if (newSlider) {
        resolve({
          status: "Ok",
          message: "Create slider success",
          data: newSlider,
        });
      }
    } catch (e) {
      reject(e);
      console.log("Err", e);
    }
  });
};

module.exports = {
  createSlider,
};
