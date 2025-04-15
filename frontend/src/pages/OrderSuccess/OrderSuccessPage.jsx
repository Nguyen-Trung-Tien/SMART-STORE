import React from "react";
import {
  Label,
  WrapperInfo,
  WrapperContainer,
  WrapperValue,
  WrapperItemOrder,
  WrapperItemsOrderInfo,
} from "./style";

import Loading from "../../components/LoadingComponent/Loading";
import { useLocation } from "react-router-dom";
import { orderConstant } from "../../constant";
import { convertPrice } from "../../utils";

const OrderSuccessPage = () => {
  const location = useLocation();
  const { state } = location;
  return (
    <div style={{ background: "#f5f5fa", width: "100%", height: "100vh" }}>
      <Loading isLoading={false}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h3 style={{ fontSize: "24px", marginTop: "10px" }}>
            Đơn hàng đặt thành công
          </h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WrapperContainer>
              <WrapperInfo>
                <div>
                  <Label>Phương thức giao hàng</Label>
                  <WrapperValue>
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      <span>{orderConstant.delivery[state?.delivery]}</span>
                    </span>
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Label>Phương thức thanh toán</Label>
                  <WrapperValue>
                    {orderConstant.payment[state?.payment]}
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperItemsOrderInfo>
                {state?.order?.map((orders) => {
                  return (
                    <WrapperItemOrder key={orders?.product}>
                      <div
                        style={{
                          width: "500px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <img
                          src={orders?.image}
                          alt="img"
                          style={{
                            width: "77px",
                            height: "79px",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            width: 260,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {orders?.name}
                        </div>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        <span>
                          <span
                            style={{
                              fontSize: "16px",
                              color: "#242424",
                              fontWeight: "bold",
                            }}
                          >
                            Giá tiền: {convertPrice(orders?.price)}
                          </span>
                        </span>
                        <span>
                          <span
                            style={{
                              fontSize: "16px",
                              color: "#242424",
                              fontWeight: "bold",
                            }}
                          >
                            Số lượng: {orders?.amount}
                          </span>
                        </span>
                      </div>
                    </WrapperItemOrder>
                  );
                })}
              </WrapperItemsOrderInfo>
              <span>
                <span
                  style={{
                    fontSize: "20px",
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  Tổng tiền: {convertPrice(state?.totalPriceMemo)}
                </span>
              </span>
            </WrapperContainer>
          </div>
        </div>
      </Loading>
    </div>
  );
};

export default OrderSuccessPage;
