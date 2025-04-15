import { Col, Image, Row } from "antd";
import React, { useEffect, useState } from "react";
import ImageSmall from "../../assets/ImageSmall/testSmall.webp";
import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQuantityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyLeNameProduct,
  WrapperStyleTextSell,
} from "./style";
import * as ProductService from "../../services/ProductServices";
import { MinusOutlined, PlusOutlined, StarFilled } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct, resetOrder } from "../../redux/slices/orderSlice";
import { convertPrice, intitFakeBookSDK } from "../../utils";
import * as message from "../../components/Message/Message";
import LikeButtonComponent from "../LikeButtonComponent/LikeButtonComponent";
import CommentComponent from "../CommentComponent/CommentComponent";

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res?.data;
    }
  };

  const { isPending, data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });

  useEffect(() => {
    const orderRedux = order?.orderItems?.find(
      (item) => item.product === productDetails?._id
    );
    if (
      orderRedux?.amount + numProduct <= orderRedux?.countInStock ||
      !orderRedux ||
      (!orderRedux && productDetails?.countInStock > 0)
    ) {
      setErrorLimitOrder(false);
    } else {
      setErrorLimitOrder(true);
    }
  }, [numProduct]);

  useEffect(() => {
    if (order.isSuccessOrder) {
      message.success("Thêm vào giỏ hàng thành công");
    }
    return () => {
      dispatch(resetOrder());
    };
  }, [order.isSuccessOrder]);

  const handleChangeCount = (type, limited) => {
    if (type === "increase") {
      if (!limited) {
        setNumProduct(numProduct + 1);
      }
    } else {
      if (!limited) {
        setNumProduct(numProduct - 1);
      }
    }
  };

  useEffect(() => {
    intitFakeBookSDK();
  });

  const renderStars = (num) => {
    if (!num || num <= 0) return null;
    const stars = [];
    const fullStars = Math.floor(num);
    const hasHalfStar = num % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarFilled
          key={`full-${i}`}
          style={{ color: "#fadb14", fontSize: "14px" }}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarFilled
          key="half"
          style={{
            color: "#fadb14",
            fontSize: "14px",
            clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)", // Render half star
          }}
        />
      );
    }

    return stars;
  };

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item?.product === productDetails?._id
      );
      if (
        orderRedux?.amount + numProduct <= orderRedux?.countInStock ||
        !orderRedux ||
        (!orderRedux && productDetails?.countInStock > 0)
      ) {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInStock: productDetails?.countInStock,
            },
          })
        );
      } else {
        setErrorLimitOrder(true);
      }
    }
  };
  return (
    <Loading isLoading={isPending}>
      <Row
        style={{
          padding: "16px",
          backgroundColor: "#fff",
          borderRadius: "4px",
        }}
      >
        <Col
          span={10}
          style={{ borderRight: "1px solid #e5e5e5", paddingRight: "8px" }}
        >
          <Image
            src={productDetails?.image}
            alt="image Product"
            preview={false}
          />
          <Row style={{ marginTop: "12px", justifyContent: "space-between" }}>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={ImageSmall}
                alt="image Small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={ImageSmall}
                alt="image Small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={ImageSmall}
                alt="image Small"
                preview={false}
              />
            </WrapperStyleColImage>
          </Row>
        </Col>
        <Col span={14} style={{ paddingLeft: "10px" }}>
          <WrapperStyLeNameProduct>
            {productDetails?.name}
          </WrapperStyLeNameProduct>
          <div>
            {renderStars(productDetails?.rating)}
            <WrapperStyleTextSell>
              | Đã bán: {productDetails?.selling || 0}
            </WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {convertPrice(productDetails?.price)}
            </WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến</span>
            <span className="address"> {user?.address} </span> -
            <span className="change-address"> Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <LikeButtonComponent
            dataHref={"https://developers.facebook.com/docs/plugins/"}
          ></LikeButtonComponent>
          <div
            style={{
              margin: "10px 0",
              padding: "10px 0",
              borderBottom: "1px solid #e5e5e5",
              borderTop: "1px solid #e5e5e5",
            }}
          >
            <div style={{ marginBottom: "10px" }}>Số lượng</div>
            <WrapperQuantityProduct>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() => handleChangeCount("decrease", numProduct === 1)}
              >
                <MinusOutlined
                  style={{ color: "#000", fontSize: "20px" }}
                  size="14px"
                />
              </button>
              <WrapperInputNumber
                onChange={onChange}
                size="small"
                min={1}
                max={productDetails?.countInStock}
                defaultValue={1}
                value={numProduct}
              />
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleChangeCount(
                    "increase",
                    numProduct === productDetails?.countInStock
                  )
                }
              >
                <PlusOutlined
                  style={{ color: "#000", fontSize: "20px" }}
                  size="14px"
                />
              </button>
            </WrapperQuantityProduct>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div>
              <ButtonComponent
                size={40}
                styleButton={{
                  background: "rgb(255, 66, 78)",
                  height: "40px",
                  width: "220px",
                  borderRadius: "4px",
                  border: "none",
                }}
                onClick={handleAddOrderProduct}
                textButton={"Chọn mua"}
                styleTextButton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
              {errorLimitOrder && (
                <div
                  style={{
                    color: "red",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                >
                  Sản phẩm đã hết hàng
                </div>
              )}
            </div>
            <ButtonComponent
              size={40}
              styleButton={{
                background: "#fff",
                height: "40px",
                width: "220px",
                borderRadius: "4px",
                border: "1px solid rgb(13, 92, 182)",
              }}
              textButton={"Mua trả sau"}
              styleTextButton={{
                color: "rgb(13, 92, 182)",
                fontSize: "15px",
              }}
            ></ButtonComponent>
          </div>
        </Col>
        {/* <CommentComponent
          dataHref={
            "https://developers.facebook.com/docs/plugins/comments#configurator"
          }
          width="1270px"
        /> */}
      </Row>
    </Loading>
  );
};

export default ProductDetailsComponent;
