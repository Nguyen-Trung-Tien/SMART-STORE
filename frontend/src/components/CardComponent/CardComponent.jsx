import React from "react";
import {
  StyleNameProducts,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
  WrapperStyleTextSell,
} from "./style";
import { StarFilled } from "@ant-design/icons";
import logo from "../../assets/ImageSmall/logo.png";

const CardComponent = (props) => {
  const {
    countInStock,
    description,
    image,
    name,
    price,
    rating,
    type,
    discount,
    selling,
  } = props;

  return (
    <WrapperCardStyle
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
      <StyleNameProducts>{name}</StyleNameProducts>
      <WrapperReportText>
        <span style={{ marginRight: "5px" }}>
          <span>{rating}</span>
          <StarFilled style={{ color: "#fadb14", fontSize: "14px" }} />
        </span>
        <WrapperStyleTextSell>
          {" "}
          | Đã bán: {selling || 1000} +
        </WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: "8px" }}>{price} </span>{" "}
        <WrapperDiscountText>{discount || 5} %</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
