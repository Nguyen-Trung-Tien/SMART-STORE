import { Col, Image, Row } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  ErrorText,
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
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
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
import Descriptions from "../Descriptions/Descriptions";
import defaultImage from "../../assets/images/defaultImage.jpg";
import Rating from "../RatingComponent/Rating";

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const onChange = (value) => {
    if (value > productDetails?.countInStock) {
      setNumProduct(productDetails?.countInStock);
      setErrorLimitOrder(true);
    } else if (value < 1) {
      setNumProduct(1);
      setErrorLimitOrder(false);
    } else {
      setNumProduct(Number(value));
      setErrorLimitOrder(false);
    }
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
    } else if (productDetails?.countInStock === 0) {
      setErrorLimitOrder(true);
    }
  }, [numProduct, productDetails]);

  useEffect(() => {
    if (order?.isSuccessOrder) {
      message.success("Thêm vào giỏ hàng thành công");
    }
    return () => {
      dispatch(resetOrder());
    };
  }, [order?.isSuccessOrder]);

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

  // useEffect(() => {
  //   intitFakeBookSDK();
  // });
  const smallImages = productDetails?.smallImages || [productDetails?.image];
  const collapseItems = productDetails?.descriptions
    ? productDetails.descriptions.map((item, index) => ({
        key: index + 1,
        label: item.title,
        children: <p>{item.content}</p>,
      }))
    : [
        {
          key: 1,
          label: "Mô tả sản phẩm",
          children: <p>{productDetails?.description}</p>,
        },
        {
          key: 2,
          label: "Thông số sản phẩm ",
          children: (
            <div>
              <p>
                <strong>Tên sản phẩm:</strong> {productDetails?.name}
              </p>
              <p>
                <strong>Thương hiệu:</strong> {productDetails?.type}
              </p>
              <p>
                <strong>Giá:</strong> {convertPrice(productDetails?.price)}
              </p>
              <p>
                <strong>Giảm giá:</strong> {productDetails?.discount || 0}%
              </p>
              <p>
                <strong>Chất liệu:</strong>Chưa có thông tin
              </p>
              <p>
                <strong>Trọng lượng:</strong> Chưa có thông tin
              </p>
            </div>
          ),
        },
      ];

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
              description: productDetails?.description,
              countInStock: productDetails?.countInStock,
            },
          })
        );
      } else {
        setErrorLimitOrder(true);
      }
    }
  };

  const discountedPrice =
    productDetails?.price * (1 - (productDetails?.discount || 0) / 100);

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
            src={productDetails?.image || defaultImage}
            onError={(e) => (e.target.src = defaultImage)}
            alt="image Product"
            preview={false}
          />
          <Row style={{ marginTop: "12px", justifyContent: "space-between" }}>
            {smallImages.map((img, idx) => (
              <WrapperStyleColImage span={4} key={idx}>
                <WrapperStyleImageSmall
                  src={img || defaultImage}
                  onError={(e) => (e.target.src = defaultImage)}
                  alt={`image Small ${idx + 1}`}
                  preview={false}
                />
              </WrapperStyleColImage>
            ))}
          </Row>
        </Col>
        <Col span={14} style={{ paddingLeft: "10px" }}>
          <WrapperStyLeNameProduct>
            {productDetails?.name}
          </WrapperStyLeNameProduct>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Rating rating={productDetails?.rating} />
            <WrapperStyleTextSell>
              | Đã bán: {productDetails?.selling || 0}
            </WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            {productDetails?.discount > 0 ? (
              <>
                <WrapperPriceTextProduct
                  style={{
                    textDecoration: "line-through",
                    color: "#888",
                  }}
                >
                  {convertPrice(productDetails?.price)}
                </WrapperPriceTextProduct>
                <WrapperPriceTextProduct
                  style={{
                    color: "#ff4d4f",
                    fontWeight: "700",
                  }}
                >
                  {convertPrice(discountedPrice)}
                </WrapperPriceTextProduct>
                <span
                  style={{
                    color: "#ff4d4f",
                    fontWeight: "600",
                    backgroundColor: "#fff1f0",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "13px",
                  }}
                >
                  Giảm giá: {productDetails.discount}%
                </span>
              </>
            ) : (
              <WrapperPriceTextProduct>
                {convertPrice(productDetails?.price)}
              </WrapperPriceTextProduct>
            )}
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến</span>
            <span className="address"> {user?.address} </span> -
            <span className="change-address"> Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <LikeButtonComponent
            dataHref={
              process.env.REACT_APP_IS_LOCAL
                ? "https://developers.facebook.com/docs/plugins/"
                : window.location.href
            }
          />
          <div
            style={{
              margin: "10px 0",
              padding: "10px 0",
              borderBottom: "1px solid #e5e5e5",
              borderTop: "1px solid #e5e5e5",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <span>Số lượng</span>
            </div>

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
            <span>
              {errorLimitOrder && (
                <ErrorText>
                  Số lượng vượt quá tồn kho ({productDetails?.countInStock})
                </ErrorText>
              )}
            </span>
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
                disabled={productDetails?.countInStock === 0}
                onClick={handleAddOrderProduct}
                textButton={
                  productDetails?.countInStock === 0
                    ? "Hết hàng"
                    : "Thêm vào giỏ hàng"
                }
                styleTextButton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              />
              <ButtonComponent
                size={40}
                onClick={handleAddOrderProduct}
                styleButton={{
                  background: "#fff",
                  height: "40px",
                  width: "220px",
                  borderRadius: "4px",
                  border: "1px solid rgb(13, 92, 182)",
                  marginLeft: "10px",
                }}
                textButton={"Mua trả sau"}
                styleTextButton={{
                  color: "rgb(13, 92, 182)",
                  fontSize: "15px",
                }}
              />
            </div>
          </div>
        </Col>
        <CommentComponent
          dataHref={
            process.env.REACT_APP_IS_LOCAL
              ? " https://developers.facebook.com/docs/plugins/comments#configurator"
              : window.location.href
          }
          width="1270px"
        />
        <Descriptions items={collapseItems} />
      </Row>
    </Loading>
  );
};

export default ProductDetailsComponent;
