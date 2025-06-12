import React, { useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Button, Image } from "antd";
import imageLogo from "../../assets/ImageSmall/logo-page.png";
import {
  ArrowLeftOutlined,
  EyeFilled,
  EyeInvisibleFilled,
  HomeTwoTone,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slices/userSlice";

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isShowPassWord, setIsShowPassWord] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const mutation = useMutationHooks((data) => UserService.loginUser(data));

  const { data, isPending, isSuccess, isError } = mutation;
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // useEffect(() => {
  //   if (isSuccess && data?.status === "OK") {
  //     message.success("Đăng nhập thành công!");
  //     localStorage.setItem("access_token", JSON.stringify(data?.access_token));
  //     if (data?.access_token) {
  //       const decoded = jwtDecode(data?.access_token);
  //       if (decoded?.id) {
  //         handleGetDetailsUser(decoded?.id, data?.access_token);
  //       }
  //     }
  //     navigate(location?.state || "/");
  //   } else if (isSuccess && data?.status === "ERR") {
  //     message.error(data?.message || "Lỗi đăng nhập!");
  //   } else if (isError) {
  //     message.error("Lỗi đăng nhập!");
  //   }
  // }, [isSuccess, isError, data]);

  useEffect(() => {
    const handleAfterLogin = async () => {
      if (isSuccess && data?.status === "OK") {
        message.success("Đăng nhập thành công!");
        localStorage.setItem(
          "access_token",
          JSON.stringify(data?.access_token)
        );
        if (data?.access_token) {
          const decoded = jwtDecode(data?.access_token);
          if (decoded?.id) {
            await handleGetDetailsUser(decoded?.id, data?.access_token);
          }
        }
        navigate(location?.state || "/");
      } else if (isSuccess && data?.status === "ERR") {
        message.error(data?.message || "Lỗi đăng nhập!");
      } else if (isError) {
        message.error("Lỗi đăng nhập!");
      }
    };

    handleAfterLogin();
  }, [isSuccess, isError, data]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    if (res?.status === "OK") {
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } else {
      message.error("Không lấy được thông tin người dùng.");
    }
  };

  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const handleSignIn = () => {
    mutation.mutate({ email, password });
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f4f4",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          minHeight: "470px",
          borderRadius: "8px",
          background: "#fff",
          display: "flex",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin Chào</h1>
          <p>Đăng nhập tài khoản!</p>
          <InputForm
            style={{ marginBottom: "10px" }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnChangeEmail}
          />
          <div style={{ position: "relative" }}>
            <span
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
                cursor: "pointer",
              }}
              onClick={() => setIsShowPassWord(!isShowPassWord)}
            >
              {isShowPassWord ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="password"
              type={isShowPassWord ? "text" : "password"}
              value={password}
              onChange={handleOnChangePassword}
            />
          </div>
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
          <Loading isLoading={isPending}>
            <ButtonComponent
              // disabled={!email.length || !password.length}
              disabled={!isValidEmail(email) || !password.length}
              onClick={handleSignIn}
              size={40}
              styleButton={{
                background: "rgb(255, 66, 78)",
                height: "42px",
                width: "100%",
                borderRadius: "4px",
                border: "none",
                margin: "26px 0 10px",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
              textButton={"Đăng nhập"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </Loading>
          <p>
            <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
          </p>
          <p>
            Bạn chưa có tài khoản?
            <WrapperTextLight onClick={handleNavigateSignUp}>
              Tạo tài khoản
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="image-Logo"
            height={"203px"}
            width={"203px"}
          />
          <h4>Mua sắm ngay</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignInPage;
