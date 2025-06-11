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
      style={{ width: 200 }}
      styles={{
        body: { padding: "10px" },
        header: { width: "200px", height: "200px" },
      }}
      cover={
        <img
          alt="product"
          src={image || defaultImage}
          onError={(e) => (e.target.src = defaultImage)}
        />
      }
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
          <span> {rating?.toFixed(1)}</span>
          <StarFilled style={{ color: "#fadb14", fontSize: "12px" }} />
        </span>
        <WrapperStyleTextSell>| Đã bán: {selling || 0}</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: "8px" }}>{convertPrice(price)}</span>
        <WrapperDiscountText>
          {discount > 0 && (
            <div className="badge-sale">Giảm giá: {discount}%</div>
          )}
        </WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
