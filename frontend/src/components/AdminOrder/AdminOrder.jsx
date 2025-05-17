import React, { useEffect } from "react";
import { WrapperHeader } from "./style";
import { Button, Space } from "antd";
import {
  CheckCircleOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { orderConstant } from "../../constant";
import ResponsiveChart from "./ResponsiveChart";
import { convertDataChart, convertPrice } from "../../utils";
import Loading from "../LoadingComponent/Loading";
import { data, useLocation } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as ProductService from "../../services/ProductServices";
import { message } from "antd";

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);
  const { state } = useLocation;

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
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          // setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const getAllProduct = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });
  const { isPending: isPendingProducts, data: products } = queryProduct;

  const renderAction = (record) => {
    return (
      <div>
        <CheckCircleOutlined
          style={{
            color: "blue",
            fontSize: "30px",
            cursor: "pointer",
          }}
          alt="Xác nhận"
          onClick={() => handleConfirmOrder(record)}
        />
        <CloseOutlined
          style={{
            color: "red",
            fontSize: "30px",
            cursor: "pointer",
            paddingLeft: "15px",
          }}
          alt="Hủy đơn"
          onClick={() => handleCancelOrder(record)}
        />
      </div>
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
      title: "Name",
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
      title: "Payment method",
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

  const {
    data: dataCancel,
    isPending: isPendingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancel,
  } = cancelMutation;

  const confirmMutation = useMutationHooks((data) => {
    const { id, token, orderItems } = data;
    const res = OrderService.confirmOrder(id, token, orderItems);
    return res;
  });

  const {
    data: dataConfirm,
    isPending: isPendingConfirm,
    isSuccess: isSuccessConfirm,
    isError: isErrorConfirm,
  } = confirmMutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success("Hủy đơn thành công!");
    } else if (isErrorCancel) {
      message.error("Không thể hủy đơn!");
    }
  }, [isSuccessCancel, isErrorCancel, dataCancel]);

  useEffect(() => {
    if (isSuccessConfirm && dataConfirm?.status === "OK") {
      message.success("Xác nhận đơn thành công!");
    } else if (isErrorConfirm) {
      message.error("Đã xẩy ra lỗi!");
    }
  }, [isSuccessConfirm, isErrorConfirm, dataConfirm]);

  const handleCancelOrder = (order) => {
    cancelMutation.mutate(
      { id: order?._id, token: state?.token, orderItems: order?.orderItems },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  const handleConfirmOrder = (order) => {
    confirmMutation.mutate(
      { id: order?._id, token: state?.token, orderItems: order?.orderItems },
      {
        onSuccess: () => {
          queryOrder.refetch();
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
        Paid: order?.isPaid ? "Chưa thanh toán" : "Đã thanh toán",
        Delivered: order?.isDelivered ? "Chưa nhận" : "Đã nhận",
        totalPrice: convertDataChart && convertPrice(order?.totalPrice),
        itemsPrice: convertPrice(order?.itemsPrice),
      };
    });

  return (
    <Loading isLoading={isPendingCancel || isPendingConfirm}>
      <div>
        <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
        <div style={{ width: 200, height: 200 }}>
          <ResponsiveChart data={orders?.data} />
        </div>
        <Loading isLoading={isPendingOrders}>
          <div style={{ marginTop: "20px" }}>
            <TableComponent
              columns={columns}
              isPending={isPendingOrders}
              data={dataTable}
            />
          </div>
        </Loading>
      </div>
    </Loading>
  );
};

export default AdminOrder;
