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
import { useInfiniteQuery } from "@tanstack/react-query";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [pending, setPending] = useState(false);
  const [limit, setLimit] = useState(12);
  const [typeProducts, setTypeProducts] = useState([]);

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["products", searchDebounce],
      queryFn: ({ pageParam = 1 }) =>
        ProductService.getAllProduct(searchDebounce, 12, pageParam),
      getNextPageParam: (lastPage, allPages) => {
        const totalPage = Math.ceil(lastPage.total / 12);
        if (allPages.length < totalPage) return allPages.length + 1;
        return undefined;
      },
      staleTime: 5 * 60 * 1000,
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
    <>
      <Loading isLoading={isPending || pending}>
        <div
          style={{
            borderBottom: "1px solid #efefef",
            maxWidth: "1270px",
            width: "100%",
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
              {data?.pages.map((page) =>
                page.data.map((product) => {
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
                })
              )}
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
                  !hasNextPage
                    ? "Đã tải hết sản phẩm"
                    : isFetchingNextPage
                    ? "Đang tải..."
                    : "Xem thêm"
                }
                type="outline"
                styleButton={{
                  border: "none",
                  backgroundColor: !hasNextPage ? "#ccc" : "#0b74e5",
                  color: "#fff",
                  padding: "10px 24px",
                  height: "42px",
                  width: "200px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "16px",
                  marginBottom: "16px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
                  transition: "all 0.3s ease",
                  cursor: !hasNextPage ? "not-allowed" : "pointer",
                }}
                disabled={!hasNextPage}
                styleTextButton={{
                  fontWeight: 500,
                  color: !hasNextPage ? "#fff" : "rgb(11, 116, 229)",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  if (hasNextPage) {
                    fetchNextPage();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </Loading>
    </>
  );
};

export default HomePage;
