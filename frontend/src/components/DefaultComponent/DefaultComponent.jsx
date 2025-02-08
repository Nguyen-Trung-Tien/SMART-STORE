import React from "react";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";

const DefaultComponent = ({ children }) => {
  return (
    <div>
      <HeaderComponent />
      {children}
    </div>
  );
};

export default DefaultComponent;
