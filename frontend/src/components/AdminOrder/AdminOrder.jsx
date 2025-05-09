import React from "react";
import { WrapperHeader } from "./style";
import { Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { orderConstant } from "../../constant";
import ResponsiveChart from "./ResponsiveChart";
import { convertDataChart } from "../../utils";
import Loading from "../LoadingComponent/Loading";

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);
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

  const columns = [
    {
      title: "User name",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Phone",
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
      title: "Price Items",
      dataIndex: "itemsPrice",
      ...getColumnSearchProps("itemsPrice"),
      sorter: (a, b) => a.itemsPrice.length - b.itemsPrice.length,
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
  ];

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

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
        paymentMethod: orderConstant.payment[order?.paymentMethod],
        Paid: order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
        Delivered: order?.isDelivered ? "Đã giao" : "Chưa giao",
        totalPrice: convertDataChart(order?.totalPrices),
      };
    });

  return (
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
  );
};

export default AdminOrder;
