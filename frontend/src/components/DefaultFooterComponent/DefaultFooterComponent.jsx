import React from "react";
import FooterComponent from "../FooterComponent/FooterComponent";

const DefaultFooterComponent = ({ children }) => {
  return (
    <div>
      {children}
      <FooterComponent />
    </div>
  );
};

export default DefaultFooterComponent;
