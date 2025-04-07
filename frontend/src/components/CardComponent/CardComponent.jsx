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
import { useNavigate } from "react-router-dom";

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
    id,
  } = props;
  const navigate = useNavigate();
  const handleDetailProduct = (id) => {
    navigate(`/product-details/${id}`);
  };
  return (
    <WrapperCardStyle
      style={{ width: 200 }}
      styles={{
        body: { padding: "10px" },
        header: { width: "200px", height: "200px" },
      }}
      cover={<img alt="example" src={image} />}
      onClick={() => handleDetailProduct(id)}
    >
      <img
        src={logo}
        alt="images"
        style={{
          width: "40px",
          height: "12px",
          position: "absolute",
          borderTopLeftRadius: "3px",
          top: -1,
          left: -1,
        }}
      />
      <StyleNameProducts>{name}</StyleNameProducts>
      <WrapperReportText>
        <span style={{ marginRight: "5px" }}>
          <span>{rating}</span>
          <StarFilled style={{ color: "#fadb14", fontSize: "14px" }} />
        </span>
        <WrapperStyleTextSell>
          | Đã bán: {selling || 1000} +
        </WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: "8px" }}>{price?.toLocaleString()} </span>
        <WrapperDiscountText> - {discount || 5} %</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
