import React from "react";
import DefaultComponent from "../DefaultComponent/DefaultComponent";
import DefaultFooterComponent from "../DefaultFooterComponent/DefaultFooterComponent";

const LayoutComponent = ({ children, isShowFooter, isShowHeader }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {isShowHeader && <DefaultComponent />}
      <main style={{ flex: 1 }}>{children}</main>
      {isShowFooter && <DefaultFooterComponent />}
    </div>
  );
};

export default LayoutComponent;
