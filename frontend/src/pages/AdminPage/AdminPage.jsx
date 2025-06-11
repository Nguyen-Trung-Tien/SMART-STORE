import {
  AppstoreOutlined,
  BarChartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { getItem } from "../../utils";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminOrder from "../../components/AdminOrder/AdminOrder";
import { AdminContainer, AdminSider, AdminContent } from "./style";
import AdminRevenue from "../../components/AdminRevenue/AdminRevenue";

const AdminPage = () => {
  const items = [
    getItem("Người dùng", "user", <UserOutlined />),
    getItem("Sản phẩm", "product", <AppstoreOutlined />),
    getItem("Đơn hàng", "order", <ShoppingCartOutlined />),
    getItem("Doanh thu", "revenue", <BarChartOutlined />),
  ];

  const [keySelected, setKeySelected] = useState("user");

  const renderPage = (key) => {
    switch (key) {
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      case "order":
        return <AdminOrder />;
      case "revenue":
        return <AdminRevenue />;
      default:
        return <></>;
    }
  };

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <AdminContainer style={{ marginTop: "35px" }}>
        <AdminSider
          mode="inline"
          selectedKeys={[keySelected]}
          items={items}
          onClick={handleOnClick}
        />
        <AdminContent>{renderPage(keySelected)}</AdminContent>
      </AdminContainer>
    </>
  );
};

export default AdminPage;
