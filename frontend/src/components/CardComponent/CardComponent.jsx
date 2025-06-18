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
import defaultImage from "../../assets/images/defaultImage.jpg";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";

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
      style={{ width: 200, position: "relative", overflow: "hidden" }}
      cover={
        <div style={{ position: "relative" }}>
          <img
            alt="product"
            src={image || defaultImage}
            onError={(e) => (e.target.src = defaultImage)}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
            }}
          />

          <img
            src={logo}
            alt="logo"
            style={{
              width: "45px",
              height: "14px",
              position: "absolute",
              top: 5,
              left: 5,
              borderRadius: "3px",
            }}
          />

          {discount > 0 && (
            <WrapperDiscountText>
              <div className="badge-sale">-{discount}%</div>
            </WrapperDiscountText>
          )}
        </div>
      }
      onClick={() => handleDetailProduct(id)}
    >
      <StyleNameProducts>{name}</StyleNameProducts>

      <WrapperReportText>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{ marginRight: 5, display: "flex", alignItems: "center" }}
          >
            <span>{rating?.toFixed(1)}</span>
            <StarFilled
              style={{ color: "#fadb14", fontSize: 13, marginLeft: 3 }}
            />
          </span>
          <WrapperStyleTextSell> | Đã bán: {selling || 0}</WrapperStyleTextSell>
        </div>
      </WrapperReportText>

      <WrapperPriceText>
        <span style={{ color: "#ee4d2d", fontWeight: "600", fontSize: 16 }}>
          {convertPrice(price)}
        </span>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
