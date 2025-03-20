import React, { useState } from "react";
import { Badge, Col, Popover } from "antd";
import {
  WrapperHeader,
  WrapperTextHeader,
  WrapperHeaderAccount,
  WrapperTextHeaderSmall,
  WrapperContentPopup,
} from "./style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as UserService from "../../services/UserServices";
import { useDispatch } from "react-redux";
import { resetUser } from "../../redux/slices/userSlice";
import Loading from "../LoadingComponent/Loading";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };

  const handleLogout = async () => {
    setPending(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    setPending(false);
  };

  const content = (
    <div>
      <WrapperContentPopup onClick={handleLogout}>
        Đăng xuất
      </WrapperContentPopup>
      <WrapperContentPopup>Thông tin người dùng</WrapperContentPopup>
    </div>
  );
  return (
    <div
      style={{
        width: "100%",
        background: "rgb(11, 116, 229)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <WrapperHeader>
        <Col span={5}>
          <WrapperTextHeader>SMART-STORE</WrapperTextHeader>
        </Col>
        <Col span={13}>
          <ButtonInputSearch
            size="large"
            textButton="Tìm kiếm"
            placeholder="Tìm kiếm sản phẩm ..."
            // onSearch={onSearch}
          />
        </Col>
        <Col
          span={6}
          style={{ display: "flex", gap: "54px", alignItems: "center" }}
        >
          <Loading isLoading={pending}>
            <WrapperHeaderAccount>
              <UserOutlined style={{ fontSize: "30px" }} />
              {user?.name ? (
                <>
                  <Popover content={content} trigger="click">
                    <div style={{ cursor: "pointer" }}>{user.name}</div>
                  </Popover>
                </>
              ) : (
                <div
                  onClick={handleNavigateLogin}
                  style={{ cursor: "pointer" }}
                >
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
              )}
            </WrapperHeaderAccount>
          </Loading>
          <div>
            <Badge count={5} size="small" style={{ backgroundColor: "red" }}>
              <ShoppingCartOutlined
                style={{ fontSize: "30px", color: "rgb(255, 255, 255)" }}
              />
            </Badge>
            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
          </div>
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
