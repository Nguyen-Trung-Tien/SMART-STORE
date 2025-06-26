import React, { useEffect, useMemo, useState } from "react";
import { Badge, Col, notification, Popover } from "antd";
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
import { searchProduct } from "../../redux/slices/productSlice";
import debounce from "lodash.debounce";
import { clearOrder } from "../../redux/slices/orderSlice";
const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const order = useSelector((state) => state?.order);
  const [userAvatar, setUserAvatar] = useState("");
  const [pending, setPending] = useState(false);
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };

  const handleLogout = async () => {
    try {
      setPending(true);
      await UserService.logoutUser();
      localStorage.removeItem("access_token");
      dispatch(resetUser());
      dispatch(clearOrder());
      navigate("/");
    } catch (error) {
      notification.error({
        message: "Đăng xuất thất bại",
        description: error.message || "Có lỗi xảy ra, vui lòng thử lại.",
      });
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    setUserName(user?.name || user?.email);
    setUserAvatar(user?.avatar);
  }, [user?.name, user?.avatar, user?.email]);

  const debounceSearch = useMemo(
    () =>
      debounce((value) => {
        dispatch(searchProduct(value));
      }, 500),
    [dispatch]
  );

  const onSearch = (e) => {
    debounceSearch(e.target.value);
  };

  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate("profile")}>
        Thông tin người dùng
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate("my-order")}>
        Đơn hàng của tôi
      </WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate("admin")}>
          Quản lý hệ thống
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate("logout")}>
        Đăng xuất
      </WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    if (type === "profile") {
      navigate("/profile-user");
    } else if (type === "admin") {
      navigate("/system/admin");
    } else if (type === "my-order") {
      navigate("/my-order", {
        state: { id: user?.id, token: user?.access_token },
      });
    } else if (type === "logout") {
      handleLogout();
    }
    setIsOpenPopup(false);
  };

  return (
    <div
      style={{
        width: "100%",
        background: "rgb(11, 116, 229)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <WrapperHeader
        style={{
          justifyContent: isHiddenSearch ? "space-between" : "unset",
        }}
      >
        <Col span={5}>
          <WrapperTextHeader to="/" style={{ cursor: "pointer" }}>
            SMART-STORE
          </WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13}>
            <ButtonInputSearch
              size="large"
              textButton="Tìm kiếm"
              placeholder="Tìm kiếm sản phẩm ..."
              onChange={onSearch}
            />
          </Col>
        )}

        <Col
          span={6}
          style={{ display: "flex", gap: "54px", alignItems: "center" }}
        >
          <Loading isLoading={pending}>
            <WrapperHeaderAccount>
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="avatar"
                  style={{
                    height: "30px",
                    width: "30px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <UserOutlined style={{ fontSize: "30px" }} />
              )}
              {user?.access_token ? (
                <>
                  <Popover
                    content={content}
                    trigger="click"
                    open={isOpenPopup}
                    onOpenChange={(visible) => setIsOpenPopup(visible)}
                  >
                    <div style={{ cursor: "pointer" }}>
                      {userName?.length ? userName : user?.email}
                    </div>
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
          {!isHiddenCart && (
            <div
              onClick={() => navigate("/order")}
              style={{ cursor: "pointer" }}
            >
              <Badge count={order?.orderItems?.length ?? 0} size="small">
                <ShoppingCartOutlined
                  style={{ fontSize: "30px", color: "rgb(255, 255, 255)" }}
                />
              </Badge>
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
