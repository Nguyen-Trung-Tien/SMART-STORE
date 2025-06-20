import React, { useEffect } from "react";
import { ActionContainer, IconButton, WrapperHeader } from "./style";
import { Button, Space, Tooltip } from "antd";
import { CheckOutlined, SearchOutlined, StopOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { orderConstant } from "../../constant";
import { convertPrice } from "../../utils";
import Loading from "../LoadingComponent/Loading";
import { useLocation } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { message } from "antd";
import { useQueryClient } from "@tanstack/react-query";

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);
  const { state } = useLocation;
  const queryClient = useQueryClient();

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          // ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={`${selectedKeys[0] || ""}`}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined twoToneColor={filtered ? "#1677ff" : undefined} />
    ),
    onFilter: (value, record) =>
      String(record[dataIndex]).toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          // setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const renderAction = (record) => {
    const disabled = record.isPaid || record.isDelivered;
    return (
      <ActionContainer>
        <Tooltip title="Xác nhận đơn">
          <IconButton
            bgcolor={disabled ? "#ccc" : "#52c41a"}
            onClick={() => handleConfirmOrder(record)}
            disabled={disabled}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
          >
            <CheckOutlined />
          </IconButton>
        </Tooltip>
        <Tooltip title="Hủy đơn">
          <IconButton
            bgcolor={disabled ? "#ccc" : "#f5222d"}
            onClick={() => handleCancelOrder(record)}
            disabled={disabled}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
          >
            <StopOutlined />
          </IconButton>
        </Tooltip>
      </ActionContainer>
    );
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Phone (+84)",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      ...getColumnSearchProps("address"),
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: "Name Products",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Paid",
      dataIndex: "Paid",
      ...getColumnSearchProps("Paid"),
      sorter: (a, b) => a.Paid.length - b.Paid.length,
    },
    {
      title: "Delivered",
      dataIndex: "Delivered",
      ...getColumnSearchProps("Delivered"),
      sorter: (a, b) => a.Delivered.length - b.Delivered.length,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      ...getColumnSearchProps("paymentMethod"),
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      ...getColumnSearchProps("totalPrice"),
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => renderAction(record),
    },
  ];

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

  const cancelMutation = useMutationHooks((data) => {
    const { id, token, orderItems } = data;
    const res = OrderService.cancelOrder(id, token, orderItems);
    return res;
  });

  const { isPending: isPendingCancel } = cancelMutation;

  const DeliveredMutation = useMutationHooks(
    async (order) => {
      const res = await OrderService.updateOrderDelivered(
        order._id,
        user?.access_token
      );
      return res;
    },
    {
      onSuccess: ({ res, orderId }) => {
        if (res.status === "OK") {
          queryClient.setQueryData(["orders"], (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((item) =>
                item._id === orderId ? { ...item, isDelivered: true } : item
              ),
            };
          });
        }
      },
    }
  );

  const PaidMutation = useMutationHooks(
    async (order) => {
      const res = await OrderService.updateOrderPaid(
        order._id,
        user?.access_token
      );
      return res;
    },
    {
      onSuccess: ({ res, orderId }) => {
        if (res.status === "OK") {
          queryClient.setQueryData(["orders"], (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((item) =>
                item._id === orderId ? { ...item, isPaid: true } : item
              ),
            };
          });
        }
      },
    }
  );
  const {
    data: dataPaid,
    isPending: isPendingPaid,
    isSuccess: isSuccessPaid,
    isError: isErrorPaid,
  } = PaidMutation;

  const {
    data: dataDelivery,
    isPending: isPendingDelivery,
    isSuccess: isSuccessDelivery,
    isError: isErrorDelivery,
  } = DeliveredMutation;
  const handleConfirmOrder = (order) => {
    PaidMutation.mutate(order);
    DeliveredMutation.mutate(order);
  };

  useEffect(() => {
    if (isSuccessDelivery && isSuccessPaid) {
      message.success("Xác nhận đơn thành công!");
    } else if (isErrorDelivery && isErrorPaid) {
      message.error("Đã xảy ra lỗi!");
    }
  }, [
    isSuccessDelivery,
    dataDelivery,
    isSuccessPaid,
    dataPaid,
    isErrorDelivery,
    isErrorPaid,
  ]);

  const handleCancelOrder = (order) => {
    cancelMutation.mutate(
      { id: order?._id, token: state?.token, orderItems: order?.orderItems },
      {
        onSuccess: (res, variables) => {
          queryClient.setQueryData(["orders"], (oldData) => {
            const newOrders = oldData?.data?.filter(
              (item) => item._id !== order._id
            );
            return { ...oldData, data: newOrders };
          });
          message.success("Hủy đơn thành công!");
        },
        onError: () => {
          message.error("Không thể hủy đơn!");
        },
      }
    );
  };

  const { isPending: isPendingOrders, data: orders } = queryOrder;

  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        name: order?.orderItems?.[0]?.name,
        image: order?.orderItems?.[0]?.image,
        paymentMethod: orderConstant.payment[order?.paymentMethod],
        Paid: order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
        Delivered: order?.isDelivered ? "Đã nhận" : "Chưa nhận",
        totalPrice: convertPrice(order?.totalPrice),
        itemsPrice: convertPrice(order?.itemsPrice),
      };
    });

  const isLoadingAll =
    isPendingCancel || isPendingDelivery || isPendingPaid || isPendingOrders;

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <Loading isLoading={isLoadingAll}>
        {/* <div style={{ width: 200, height: 200 }}>
          <ResponsiveChart data={orders?.data} />
        </div> */}
        <div style={{ marginTop: "20px" }}>
          <TableComponent
            fileName="Donhang"
            columns={columns}
            isPending={isPendingOrders}
            data={dataTable}
          />
        </div>
      </Loading>
    </div>
  );
};

export default AdminOrder;
