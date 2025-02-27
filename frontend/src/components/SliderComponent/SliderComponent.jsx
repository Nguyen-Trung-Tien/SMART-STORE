import { Image } from "antd";
import React from "react";
import Slider from "react-slick";

const SliderComponent = ({ arrImages }) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  return (
    <Slider {...settings}>
      {arrImages.map((image) => {
        return (
          <Image
            src={image}
            key={image}
            alt="image"
            preview={false}
            width={"100%"}
            height={"274px"}
          />
        );
      })}
    </Slider>
  );
};

export default SliderComponent;
