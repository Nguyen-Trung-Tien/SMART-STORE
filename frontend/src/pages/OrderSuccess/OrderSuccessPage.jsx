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

  if (!state) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Không tìm thấy thông tin đơn hàng.</h2>
      </div>
    );
  }

  return (
    <div style={{ background: "#f5f5fa", width: "100%", height: "100%" }}>
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
                    <span
                      style={{
                        color: "#ea8500",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {orderConstant.delivery[state?.delivery] ||
                        "Vui lòng kiểm tra đơn hàng!"}
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
                {state?.order?.length > 0 ? (
                  state.order.map((orders, index) => (
                    <WrapperItemOrder key={orders?.id || index}>
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
                  ))
                ) : (
                  <div>Không có sản phẩm trong đơn hàng.</div>
                )}
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
