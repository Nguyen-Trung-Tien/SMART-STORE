import React, { useEffect, useState } from "react";
import {
  WrapperContent,
  WrapperLabelText,
  WrapperTextPrice,
  WrapperTextValue,
} from "./style";
import { Rate } from "antd";
import * as ProductService from "../../services/ProductServices";
import Loading from "../LoadingComponent/Loading";

const NavbarComponent = ({ onFilter }) => {
  const [productList, setProductList] = useState([]);

  // State lưu lựa chọn lọc
  const [selectedType, setSelectedType] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductList = async () => {
      setLoading(true);

      try {
        const res = await ProductService.getAllProduct();
        if (res?.data) {
          setProductList(res.data);
          console.log(">>", res);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductList();
  }, []);

  const typeOptions = [...new Set(productList.map((item) => item.type))];
  const ratingOptions = [3, 4, 5];
  const priceOptions = [
    { label: "Dưới 5 triệu", min: 0, max: 5000000 },
    { label: "5 triệu - 10 triệu", min: 5000000, max: 10000000 },
    { label: "Trên 10 triệu", min: 10000000, max: Infinity },
  ];

  // Hàm gọi onFilter với tất cả bộ lọc hiện tại
  const triggerFilter = (newFilters) => {
    if (onFilter) onFilter(newFilters);
  };

  const handleTypeClick = (type) => {
    const newType = selectedType === type ? null : type;
    setSelectedType(newType);
    triggerFilter({
      type: newType,
      rating: selectedRating,
      price: selectedPrice,
    });
  };

  const handleRatingClick = (rating) => {
    const newRating = selectedRating === rating ? null : rating;
    setSelectedRating(newRating);
    triggerFilter({
      type: selectedType,
      rating: newRating,
      price: selectedPrice,
    });
  };

  const handlePriceClick = (priceObj) => {
    const newPrice = selectedPrice === priceObj.label ? null : priceObj.label;
    setSelectedPrice(newPrice);
    triggerFilter({
      type: selectedType,
      rating: selectedRating,
      price: newPrice,
    });
  };

  const renderContent = (filterType, options) => {
    switch (filterType) {
      case "text":
        return options.map((option) => (
          <WrapperTextValue
            key={option}
            onClick={() => handleTypeClick(option)}
            style={{
              cursor: "pointer",
              padding: "5px 8px",
              display: "block",
              backgroundColor:
                selectedType === option ? "#1890ff" : "transparent",
              color: selectedType === option ? "white" : "rgb(56,56,61)",
              borderRadius: "6px",
            }}
          >
            {option}
          </WrapperTextValue>
        ));

      case "star":
        return options.map((option) => (
          <div
            key={option}
            onClick={() => handleRatingClick(option)}
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              cursor: "pointer",
              padding: "5px 8px",
              borderRadius: "6px",
              backgroundColor:
                selectedRating === option ? "#1890ff" : "transparent",
              color: selectedRating === option ? "white" : "rgb(56,56,61)",
              userSelect: "none",
            }}
          >
            <Rate
              style={{ fontSize: "14px" }}
              disabled
              allowHalf
              defaultValue={option}
            />
            <span>{`Từ ${option} sao`}</span>
          </div>
        ));

      case "price":
        return options.map((option) => (
          <WrapperTextPrice
            key={option.label}
            onClick={() => handlePriceClick(option)}
            style={{
              cursor: "pointer",
              padding: "5px 8px",
              display: "block",
              backgroundColor:
                selectedPrice === option.label ? "#1890ff" : "#eee",
              color: selectedPrice === option.label ? "white" : "rgb(56,56,61)",
              borderRadius: "6px",
            }}
          >
            {option.label}
          </WrapperTextPrice>
        ));

      default:
        return null;
    }
  };

  return (
    <Loading isLoading={loading} size={20}>
      <div>
        <WrapperLabelText>Danh mục sản phẩm</WrapperLabelText>
        <WrapperContent>{renderContent("text", typeOptions)}</WrapperContent>

        <WrapperLabelText style={{ marginTop: "20px" }}>
          Đánh giá
        </WrapperLabelText>
        <WrapperContent>{renderContent("star", ratingOptions)}</WrapperContent>

        <WrapperLabelText style={{ marginTop: "20px" }}>
          Khoảng giá
        </WrapperLabelText>
        <WrapperContent>{renderContent("price", priceOptions)}</WrapperContent>
      </div>
    </Loading>
  );
};

export default NavbarComponent;
