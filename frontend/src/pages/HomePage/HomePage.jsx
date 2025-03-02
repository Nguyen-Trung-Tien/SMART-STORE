import React from "react";
import { TypeProducts } from "../../components/TypeProducts/TypeProducts";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProducts,
} from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import image1 from "../../assets/images/image1.webp";
import image2 from "../../assets/images/image2.webp";
import image3 from "../../assets/images/image3.webp";
import CardComponent from "../../components/CardComponent/CardComponent";

const HomePage = () => {
  const arr = [
    "TV",
    "Laptop",
    "Phone",
    "Tablet",
    "Watch",
    "Camera",
    "Headphone",
  ];
  return (
    <>
      <div style={{ padding: "0 120px" }}>
        <WrapperTypeProducts>
          {arr.map((item) => {
            return <TypeProducts name={item} key={item} />;
          })}
        </WrapperTypeProducts>
      </div>
      <div
        id="container"
        style={{
          backgroundColor: "#efefef",
          padding: "0 120px",
          height: "1000px",
          width: "100%",
        }}
      >
        <SliderComponent arrImages={[image1, image2, image3]} />
        <WrapperProducts>
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
        </WrapperProducts>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <WrapperButtonMore
            textButton="Xem thêm"
            type="outline"
            styleButton={{
              border: "1px solid rgb(11, 116, 229)",
              color: "rgb(11, 116, 229)",
              height: "38px",
              width: "240px",
              borderRadius: "4px",
              fontWeight: "500",
              fontSize: "16px",
            }}
            styleTextButton={{ fontWeight: 500 }}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
