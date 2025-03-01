import React from "react";
import {
  StyleNameProducts,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
} from "./style";
import { StarOutlined } from "@ant-design/icons";
import logo from "../../assets/ImageSmall/logo.png";
import { Image } from "antd";

const CardComponent = () => {
  return (
    <WrapperCardStyle
      hoverable
      style={{ width: 200 }}
      styles={{
        body: { padding: "10px" },
        header: { width: "200px", height: "200px" },
      }}
      cover={
        <img
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        />
      }
    >
      <img
        src={logo}
        style={{
          width: "60px",
          height: "18px",
          position: "absolute",
          borderTopLeftRadius: "3px",
          top: 0,
          left: 0,
        }}
      />
      <StyleNameProducts>Iphone</StyleNameProducts>
      <WrapperReportText>
        <span style={{ marginRight: "5px" }}>
          <span>4.5</span>
          <StarOutlined style={{ color: "yellow", fontSize: "12px" }} />
        </span>
        <span> | Đã bán: 1000+ </span>
      </WrapperReportText>
      <WrapperPriceText>
        10.000.000đ <WrapperDiscountText>-5%</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
