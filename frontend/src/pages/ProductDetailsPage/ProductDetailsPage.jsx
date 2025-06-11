import React from "react";
import ProductDetailsComponent from "../../components/ProDuctDetailsComponent/ProDuctDetailsComponent";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, WrapperContainer, WrapperPage } from "./styler";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <WrapperPage>
      <WrapperContainer>
        <Breadcrumb>
          <span onClick={() => navigate("/")}>Trang chủ</span>{" "}
          <strong> - Chi tiết sản phẩm</strong>
        </Breadcrumb>
        <ProductDetailsComponent idProduct={id} />
      </WrapperContainer>
    </WrapperPage>
  );
};

export default ProductDetailsPage;
