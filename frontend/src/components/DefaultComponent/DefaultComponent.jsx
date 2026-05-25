import React from "react";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";

const DefaultComponent = ({ children }) => {
  return (
    <div>
      <HeaderComponent />
      <div style={{ paddingTop: "60px" }}>{children}</div>
    </div>
  );
};

export default DefaultComponent;
