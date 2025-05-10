import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import {
  WrapperContainer,
  WrapperFooterItem,
  WrapperHeaderItems,
  WrapperItemOrder,
  WrapperListOrder,
  WrapperStatus,
} from "./style";
import { convertPrice } from "../../utils";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import Loading from "../../components/LoadingComponent/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useEffect } from "react";
import { message } from "antd";

const MyOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderbyUserId(state?.id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrder,
    enabled: !!(state?.id && state?.token),
  });

  const { isPending, data } = queryOrder;

  const renderProduct = (data) => {
    return data?.map((order) => {
      return (
        <WrapperHeaderItems key={order?._id}>
          <img
            src={order?.image}
            key={order?.image}
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
              fontSize: "16px",
              color: "#242424",
              fontWeight: "bold",
              marginLeft: "10px",
            }}
          >
            {order?.name}
          </div>
          <span
            style={{
              fontSize: "16px",
              color: "#242424",
              fontWeight: "bold",
              marginLeft: "auto",
            }}
          >
            {convertPrice(order?.price)}
          </span>
        </WrapperHeaderItems>
      );
    });
  };

  const handleDetailsOrder = async (id) => {
    navigate(`/details-order/${id}`, {
      state: { token: state?.token },
    });
  };

  const mutation = useMutationHooks((data) => {
    const { id, token, orderItems } = data;
    const res = OrderService.cancelOrder(id, token, orderItems);
    return res;
  });

  const {
    data: dataCancel,
    isPending: isPendingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancel,
  } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success("Hủy đơn thành công!");
    } else if (isErrorCancel) {
      message.error("Không thể hủy đơn!");
    }
  }, [isSuccessCancel, isErrorCancel, dataCancel]);

  const handleCancelOrder = (order) => {
    mutation.mutate(
      { id: order?._id, token: state?.token, orderItems: order?.orderItems },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  if (!state?.id || !state?.token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</h2>
      </div>
    );
  }

  return (
    <WrapperContainer>
      <div style={{ height: "100vh", width: "1270px", margin: "0 auto" }}>
        <h4>Đơn hàng của tôi</h4>
        <Loading isLoading={isPending || isPendingCancel}>
          <WrapperListOrder>
            {Array.isArray(data) && data.length > 0 ? (
              data?.map((order) => {
                return (
                  <WrapperItemOrder key={order?._id}>
                    <WrapperStatus>
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        Trạng thái đơn hàng:
                      </span>
                      <div>
                        <span>
                          Giao hàng:
                          <span
                            style={{
                              color: "rgb(255, 66, 78)",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >{`${
                            order?.isDelivered ? "Đã giao" : "Chưa giao"
                          } `}</span>
                        </span>
                      </div>
                      <div>
                        <span>
                          thanh toán:
                          <span
                            style={{
                              color: "rgb(255, 66, 78)",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >{`${
                            order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"
                          } `}</span>
                        </span>
                      </div>
                    </WrapperStatus>
                    {renderProduct(order?.orderItems)}
                    <WrapperFooterItem>
                      <div>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "rgb(255, 66, 78)",
                          }}
                        >
                          Tổng tiền:
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            color: "rgb(56, 51, 61)",
                            fontWeight: "bold",
                            marginLeft: "10px",
                          }}
                        >
                          {convertPrice(order?.totalPrice)}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <ButtonComponent
                          onClick={() => handleCancelOrder(order)}
                          size={40}
                          styleButton={{
                            height: "36px",
                            border: "1px solid rgb(11, 166,229)",
                            color: "rgb(255, 66, 78)",
                          }}
                          textButton={" Hủy đơn hàng"}
                          styleTextButton={{
                            color: "rgb(11, 166,229)",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        ></ButtonComponent>
                        <ButtonComponent
                          onClick={() => handleDetailsOrder(order?._id)}
                          size={40}
                          styleButton={{
                            height: "36px",
                            border: "1px solid rgb(11, 166,229)",
                            color: "rgb(255, 66, 78)",
                          }}
                          textButton={" Xem chi tiết"}
                          styleTextButton={{
                            color: "rgb(11, 166,229)",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        ></ButtonComponent>
                      </div>
                    </WrapperFooterItem>
                  </WrapperItemOrder>
                );
              })
            ) : (
              <p>Không có sản phẩm nào! </p>
            )}
          </WrapperListOrder>
        </Loading>
      </div>
    </WrapperContainer>
  );
};

export default MyOrderPage;
