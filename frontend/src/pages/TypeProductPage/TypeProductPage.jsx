import React, { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row } from "antd";
import { WrapperNavbar, WrapperProducts } from "./style";
import * as ProductService from "../../services/ProductServices";
import { useLocation } from "react-router-dom";
import Loading from "../../components/LoadingComponent/Loading";
const TypeProductPage = () => {
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [pending, setPending] = useState(false);
  const onChange = () => {};
  const fetchProductType = async (type) => {
    const res = await ProductService.getProductType(type);
    if (res?.status === "OK") {
      setPending(false);
      setProducts(res?.data);
    } else {
      setPending(false);
    }
  };

  useEffect(() => {
    if (state) {
      fetchProductType(state);
    }
  }, [state]);

  return (
    <Loading isLoading={pending}>
      <div
        style={{
          width: "100%",
          background: "#efefe",
          height: "calc(100vh-60px)",
        }}
      >
        <div style={{ width: "1270px", margin: "0 auto" }}>
          <Row
            style={{
              flexWrap: "nowrap ",
              paddingTop: "20px",
            }}
          >
            <WrapperNavbar span={4}>
              <NavbarComponent />
            </WrapperNavbar>
            <Col
              span={20}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <WrapperProducts>
                {products?.map((product) => {
                  return (
                    <CardComponent
                      key={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      discount={product.discount}
                      selling={product.selling}
                      id={product._id}
                    />
                  );
                })}
              </WrapperProducts>
              <Pagination
                defaultCurrent={2}
                total={100}
                onChange={onChange}
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  );
};

export default TypeProductPage;
