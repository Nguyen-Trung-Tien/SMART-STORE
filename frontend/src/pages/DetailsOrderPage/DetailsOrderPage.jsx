import React, { useMemo } from "react";
import {
  WrapperAllPrice,
  WrapperContentInfo,
  WrapperHeaderUser,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLabel,
  WrapperNameProduct,
  WrapperProduct,
  WrapperStyContent,
} from "./style";
import * as OrderService from "../../services/OrderService";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { orderConstant } from "../../constant";
import { convertPrice } from "../../utils";
import Loading from "../../components/LoadingComponent/Loading";

const DetailsOrderPage = () => {
  const location = useLocation();
  const params = useParams();
  const { id } = params;
  const { state } = location;

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["order-details", id],
    queryFn: fetchDetailsOrder,
    enabled: !!id && !!state?.token,
  });

  const { isPending, data } = queryOrder;
  let shippingAddress,
    orderItems,
    shippingPrice,
    paymentMethod,
    isPaid,
    totalPrice;

  if (data) {
    ({
      shippingAddress,
      orderItems,
      shippingPrice,
      paymentMethod,
      isPaid,
      totalPrice,
    } = data);
  }
  const priceMemo = useMemo(() => {
    if (!data?.orderItems) return 0;
    return data.orderItems.reduce((total, cur) => {
      return total + (cur.price || 0) * (cur.amount || 0);
    }, 0);
  }, [data]);

  return (
    <Loading isLoading={isPending}>
      <div style={{ width: "100%", backgroundColor: "#f5f5fa" }}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h4 style={{ fontSize: "14px" }}>Chi tiết đơn hàng</h4>
          <WrapperHeaderUser>
            <WrapperInfoUser>
              <WrapperLabel>Địa chỉ người nhận </WrapperLabel>
              <WrapperContentInfo>
                <div className="user-info">
                  Họ và tên: {shippingAddress?.fullName}
                </div>
                <div className="address-info">
                  <span>Địa chỉ:</span>{" "}
                  {`${shippingAddress?.address} ${shippingAddress?.city}`}
                </div>
                <div className="phone-info">
                  <span>SĐT(+84): </span> {shippingAddress?.phone}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>Phương thức giao hàng </WrapperLabel>
              <WrapperContentInfo>
                <div className="delivery-info">
                  <span className="name-delivery"></span>
                  {} Giao hàng nhanh
                </div>
                <div className="delivery-free">
                  <span>Phí giao:</span> {convertPrice(shippingPrice)}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>Trạng thái thanh toán </WrapperLabel>
              <WrapperContentInfo>
                <div className="payment-info">Phương thức: {paymentMethod}</div>
                <div className="status-payment">
                  Trạng thái: {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
          </WrapperHeaderUser>
          <WrapperStyContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                border: "1px solid #f5f5f5",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  textAlign: "center",
                  marginRight: "270px",
                  width: "300px",
                }}
              >
                Sản phẩm
              </div>
              <WrapperItemLabel>Giá sản phẩm</WrapperItemLabel>
              <WrapperItemLabel>Số lượng</WrapperItemLabel>
              <WrapperItemLabel>Giảm giá</WrapperItemLabel>
            </div>
            {orderItems?.map((order, index) => {
              return (
                <WrapperProduct key={order._id || index}>
                  <WrapperNameProduct>
                    <img
                      src={order?.image}
                      alt="img"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        padding: "2px",
                      }}
                    />
                    <div
                      style={{
                        width: 260,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        height: "70px",
                        marginLeft: "10px",
                      }}
                    >
                      {order?.name}
                    </div>
                  </WrapperNameProduct>
                  <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                  <WrapperItem>{order?.amount}</WrapperItem>
                  <WrapperItem>
                    {order?.discount
                      ? convertPrice((priceMemo * order?.discount) / 100)
                      : "0 VND"}
                  </WrapperItem>
                </WrapperProduct>
              );
            })}

            <WrapperAllPrice>
              <WrapperItemLabel>Tạm tính:</WrapperItemLabel>
              <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>Phí giao hàng:</WrapperItemLabel>
              <WrapperItem>
                {convertPrice(data?.shippingPrice) || 0}
              </WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>Tổng tiền:</WrapperItemLabel>
              <WrapperItem>{convertPrice(totalPrice)}</WrapperItem>
            </WrapperAllPrice>
          </WrapperStyContent>
        </div>
      </div>
    </Loading>
  );
};

export default DetailsOrderPage;
