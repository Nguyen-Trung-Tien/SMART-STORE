import { Image } from "antd";
import React from "react";
import { WarperSliderStyle } from "./style";

const SliderComponent = ({ arrImages }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  };
  return (
    <WarperSliderStyle WarperSliderStyle {...settings}>
      {arrImages.map((image) => {
        return (
          <Image
            src={image}
            key={image}
            alt="image"
            preview={false}
            width={"100%"}
            height={"240px"}
          />
        );
      })}
    </WarperSliderStyle>
  );
};

export default SliderComponent;
