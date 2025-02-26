import React from "react";
import { TypeProducts } from "../../components/TypeProducts/TypeProducts";
import { WrapperTypeProducts } from "./style";

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
    <div style={{ padding: "0 120px" }}>
      <WrapperTypeProducts>
        {arr.map((item) => {
          return <TypeProducts name={item} key={item} />;
        })}
      </WrapperTypeProducts>
    </div>
  );
};

export default HomePage;
