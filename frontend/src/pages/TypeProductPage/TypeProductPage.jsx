import React, { useCallback, useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Row } from "antd";
import { StyledPagination, WrapperNavbar, WrapperProducts } from "./style";
import * as ProductService from "../../services/ProductServices";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const [paginate, setPaginate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });

  const [selectedType, setSelectedType] = useState(state || "");

  const fetchProductType = useCallback(async (type, page, limit) => {
    setPending(true);
    const res = await ProductService.getProductType(type, page, limit);
    if (res?.status === "OK") {
      setProducts(res?.data);
      setPending(false);
      setPaginate((prev) => {
        if (prev.total !== res?.totalPage) {
          return { ...prev, total: res?.totalPage };
        }
        return prev;
      });
    } else {
      setPending(false);
    }
  }, []);

  useEffect(() => {
    if (selectedType) {
      fetchProductType(selectedType, paginate.page, paginate.limit);
    } else {
      navigate("/");
      alert("Không tìm thấy sản phẩm!");
    }
  }, [selectedType, paginate.page, paginate.limit, fetchProductType, navigate]);

  useEffect(() => {
    if (searchDebounce) {
      const filtered = products.filter((pro) =>
        pro?.name?.toLowerCase().includes(searchDebounce.toLowerCase())
      );
      setProducts(filtered);
    } else if (selectedType) {
      fetchProductType(selectedType, paginate.page, paginate.limit);
    }
  }, [searchDebounce]);

  const handleFilter = (filterObj) => {
    if (filterObj.type && filterObj.type !== selectedType) {
      setSelectedType(filterObj.type);
      setPaginate((prev) => ({ ...prev, page: 0 }));
    }
  };

  const onChange = (current, pageSize) => {
    setPaginate({
      ...paginate,
      page: current - 1,
      limit: pageSize,
    });
  };

  return (
    <Loading isLoading={pending}>
      <div
        style={{
          width: "100%",
          background: "#efefe",
          height: "calc(100vh - 64px)",
        }}
      >
        <div style={{ width: "1270px", height: "100%", margin: "0 auto" }}>
          <Row
            style={{
              height: "calc(100% - 20px)",
              flexWrap: "nowrap",
              paddingTop: "10px",
            }}
          >
            <WrapperNavbar span={4}>
              <NavbarComponent onFilter={handleFilter} />
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
                {products
                  ?.filter(
                    (pro) =>
                      searchDebounce === "" ||
                      pro?.name
                        ?.toLowerCase()
                        .includes(searchDebounce.toLowerCase())
                  )
                  ?.map((product) => (
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
                  ))}
              </WrapperProducts>
              <StyledPagination
                current={paginate.page + 1}
                total={paginate.total * paginate.limit}
                onChange={onChange}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  );
};

export default TypeProductPage;
