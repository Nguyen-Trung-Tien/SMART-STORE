import React from "react";
import ProductDetailsComponent from "../../components/ProDuctDetailsComponent/ProDuctDetailsComponent";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundColor: "#efefef",
        height: "100vh",
        width: "100%",
      }}
    >
      <div style={{ width: "1270px", margin: "0 auto", height: "100%" }}>
        <h5>
          <span
            style={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/")}
          >
            Trang chủ
          </span>
          - Chi tiết sản phẩm
        </h5>
        <ProductDetailsComponent idProduct={id} />
      </div>
    </div>
  );
};
export default ProductDetailsPage;
