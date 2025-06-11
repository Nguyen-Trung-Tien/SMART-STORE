import React, { useEffect, useState } from "react";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProducts,
} from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import image1 from "../../assets/images/image-1.png";
import image2 from "../../assets/images/image-2.png";
import image3 from "../../assets/images/img-3.png";
import CardComponent from "../../components/CardComponent/CardComponent";
import TypeProducts from "../../components/TypeProducts/TypeProducts";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductServices";
import { useSelector } from "react-redux";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [pending, setPending] = useState(false);
  const [limit, setLimit] = useState(6);

  const [typeProducts, setTypeProducts] = useState([]);

  // const fetchProductAll = async ({ queryKey }) => {
  //   const [, limit, search] = queryKey;
  //   try {
  //     const res = await ProductService.getAllProduct(search, limit);
  //     return res;
  //   } catch (err) {
  //     console.error("Fetch product error:", err);
  //     return { data: [], total: 0 };
  //   }
  // };

  const fetchAllTypeProduct = async () => {
    try {
      const res = await ProductService.getAllTypeProduct();
      if (res?.status === "OK") {
        setTypeProducts(res?.data);
      }
    } catch (err) {
      console.error("Fetch type error:", err);
    }
  };

  const {
    data: products,
    isPending,
    isPreviousData,
  } = useQuery({
    queryKey: ["products", limit, searchDebounce],
    queryFn: () => ProductService.getAllProduct(searchDebounce, limit),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
    enabled: searchDebounce.length === 0 || searchDebounce.length >= 2,
  });

  useEffect(() => {
    const fetchData = async () => {
      setPending(true);
      await fetchAllTypeProduct();
      setPending(false);
    };
    fetchData();
  }, []);

  return (
    <Loading isLoading={isPending || pending}>
      <div
        style={{
          width: "1270px",
          margin: " 0 auto",
        }}
      >
        <WrapperTypeProducts>
          {typeProducts?.map((item) => {
            return <TypeProducts name={item} key={item} />;
          })}
        </WrapperTypeProducts>
      </div>
      <div
        className="body"
        style={{ width: "100%", backgroundColor: "#efefef" }}
      >
        <div
          id="container"
          style={{
            backgroundColor: "#efefef",
            width: "1270px",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          <SliderComponent arrImages={[image1, image2, image3]} />
          <WrapperProducts>
            {products?.data?.map((product) => {
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: "10px",
            }}
          >
            <WrapperButtonMore
              textButton={
                products?.data?.length >= products?.total
                  ? "Đã tải hết sản phẩm"
                  : isPreviousData
                  ? "Load more"
                  : "Xem thêm"
              }
              type="outline"
              styleButton={{
                border: "1px solid rgb(11, 116, 229)",
                color:
                  products?.data?.length >= products?.total
                    ? "#f5f5fa"
                    : "rgb(11, 116, 229)",
                height: "38px",
                width: "240px",
                borderRadius: "4px",
                fontWeight: "500",
                fontSize: "16px",
              }}
              disabled={
                products?.data?.length >= products?.total ||
                products?.totalPage === 1
              }
              styleTextButton={{
                fontWeight: 500,
                color: products?.data?.length >= products?.total && "#fff",
              }}
              onClick={() => {
                if (products?.data?.length < products?.total) {
                  setLimit((prev) => prev + 6);
                }
              }}
            />
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default HomePage;
