import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import {
  WrapperContainer,
  WrapperFooterItem,
  WrapperHeader,
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
import { Button, message, Result } from "antd";
import { HomeTwoTone, SmileOutlined } from "@ant-design/icons";

const MyOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const fetchMyOrder = async () => {
    try {
      const res = await OrderService.getOrderbyUserId(state?.id, state?.token);
      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const queryOrder = useQuery({
    queryKey: ["orders", state?.id],
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

  const cancelMutation = useMutationHooks((data) => {
    const { id, token, orderItems } = data;
    const res = OrderService.cancelOrder(id, token, orderItems);
    return res;
  });

  const {
    data: dataCancel,
    isPending: isPendingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancel,
  } = cancelMutation;

  const confirmMutation = useMutationHooks(async (order) => {
    await OrderService.updateOrderPaid(order._id, order.token);
    await OrderService.updateOrderDelivered(order._id, order.token);
    return { status: "OK" };
  });
  const {
    data: dataConfirm,
    isPending: isPendingConfirm,
    isSuccess: isSuccessConfirm,
    isError: isErrorConfirm,
  } = confirmMutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success("Hủy thành công!");
    } else if (isErrorCancel) {
      message.error("Không thể hủy!");
    }
  }, [isSuccessCancel, isErrorCancel, dataCancel]);

  useEffect(() => {
    if (isSuccessConfirm && dataConfirm?.status === "OK") {
      message.success("Xác nhận thành công!");
    } else if (isErrorConfirm) {
      message.error("Không thể xác nhận!");
    }
  }, [isSuccessConfirm, isErrorConfirm, dataConfirm]);

  const handleCancelOrder = (order) => {
    cancelMutation.mutate(
      { id: order?._id, token: state?.token, orderItems: order?.orderItems },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
        onError: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  const handleConfirmOrder = (order) => {
    confirmMutation.mutate(
      { ...order, token: state?.token },
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
        <h2>Vui lòng đăng nhập lại!</h2>
      </div>
    );
  }

  return (
    <WrapperContainer>
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <WrapperHeader>Đơn hàng của tôi</WrapperHeader>
        <Loading isLoading={isPending || isPendingConfirm || isPendingCancel}>
          <WrapperListOrder>
            {Array.isArray(data) && data.length > 0 ? (
              data?.map((order) => {
                return (
                  <WrapperItemOrder key={order?._id}>
                    <WrapperStatus>
                      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                        Trạng thái đơn hàng:
                      </span>
                      <div>
                        <span style={{ fontSize: "16px" }}>
                          Giao hàng:
                          <span
                            style={{
                              color: "rgb(255, 66, 78)",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            {" "}
                            {`${order?.isDelivered ? "Đã nhận" : "Chưa nhận"} `}
                          </span>
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: "16px" }}>
                          Thanh toán:
                          <span
                            style={{
                              color: "rgb(255, 66, 78)",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            {" "}
                            {`${
                              order?.isPaid
                                ? "Đã thanh toán"
                                : "Chưa thanh toán"
                            } `}
                          </span>
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
                        {!order.isDelivered && !order.isCancelled && (
                          <>
                            <ButtonComponent
                              onClick={() => handleConfirmOrder(order)}
                              size={40}
                              styleButton={{
                                height: "36px",
                                border: "1px solid rgb(11, 166,229)",
                                color: "rgb(255, 66, 78)",
                              }}
                              textButton={"Xác nhận"}
                              styleTextButton={{
                                color: "rgb(11, 166,229)",
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            />
                            <ButtonComponent
                              onClick={() => handleCancelOrder(order)}
                              size={40}
                              styleButton={{
                                height: "36px",
                                border: "1px solid rgb(11, 166,229)",
                                color: "rgb(255, 66, 78)",
                              }}
                              textButton={" Hủy đơn "}
                              styleTextButton={{
                                color: "rgb(11, 166,229)",
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            />
                          </>
                        )}

                        <ButtonComponent
                          onClick={() => handleDetailsOrder(order?._id)}
                          size={40}
                          styleButton={{
                            height: "36px",
                            border: "1px solid rgb(11, 166,229)",
                            color: "rgb(255, 66, 78)",
                          }}
                          textButton={" Chi tiết"}
                          styleTextButton={{
                            color: "rgb(11, 166,229)",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        />
                      </div>
                    </WrapperFooterItem>
                  </WrapperItemOrder>
                );
              })
            ) : (
              <div>
                <Result
                  icon={<SmileOutlined />}
                  title="Hiện không có sản phẩm nào!"
                  extra={
                    <Button
                      type="primary"
                      onClick={() => navigate("/")}
                      style={{ background: "rgb(11, 116, 229)" }}
                    >
                      Quay về trang chủ
                      <HomeTwoTone style={{ fontSize: "20px" }} />
                    </Button>
                  }
                  style={{ height: "100vh" }}
                />
              </div>
            )}
          </WrapperListOrder>
        </Loading>
      </div>
    </WrapperContainer>
  );
};

export default MyOrderPage;
