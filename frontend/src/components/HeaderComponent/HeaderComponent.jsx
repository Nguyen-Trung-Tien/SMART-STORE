import React from "react";
import { Col } from "antd";
import {
  WrapperHeader,
  WrapperTextHeader,
  WrapperHeaderAccount,
  WrapperTextHeaderSmall,
} from "./style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";

const HeaderComponent = () => {
  return (
    <div>
      <WrapperHeader gutter={24}>
        <Col span={6}>
          <WrapperTextHeader>STORE</WrapperTextHeader>
        </Col>
        <Col span={12}>
          <ButtonInputSearch
            size="large"
            textButton="Tìm kiếm"
            placeholder="input search text"
            // onSearch={onSearch}
          />
        </Col>
        <Col
          span={6}
          style={{ display: "flex", gap: "20px", alignItems: "center" }}
        >
          <WrapperHeaderAccount>
            <UserOutlined style={{ fontSize: "30px" }} />
            <div>
              <WrapperTextHeaderSmall style={{ fontSize: "12px" }}>
                Đăng ký/ Đăng nhập
              </WrapperTextHeaderSmall>
              <div>
                <WrapperTextHeaderSmall style={{ fontSize: "12px" }}>
                  Tài khoản
                </WrapperTextHeaderSmall>
                <CaretDownOutlined />
              </div>
            </div>
          </WrapperHeaderAccount>
          <div>
            <ShoppingCartOutlined
              style={{ fontSize: "30px", color: "rgb(255, 255, 255)" }}
            />
            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
          </div>
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
