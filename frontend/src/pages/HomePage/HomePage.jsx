import React from "react";
import { TypeProducts } from "../../components/TypeProducts/TypeProducts";
import { WrapperTypeProducts } from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import image1 from "../../assets/images/image1.webp";
import image2 from "../../assets/images/image2.webp";
import image3 from "../../assets/images/image3.webp";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";

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
        }}
      >
        <SliderComponent arrImages={[image1, image2, image3]} />
        <div
          style={{
            display: "flex",
            marginTop: "20px",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <CardComponent />
        </div>
        <NavbarComponent />
      </div>
    </>
  );
};

export default HomePage;
