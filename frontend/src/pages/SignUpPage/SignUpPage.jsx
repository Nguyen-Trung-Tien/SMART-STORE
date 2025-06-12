import React, { useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import { Image } from "antd";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import imageLogo from "../../assets/ImageSmall/logo-page.png";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [isShowPassWord, setIsShowPassWord] = useState(false);
  const [isShowConfirmPassWord, setIsShowConfirmPassWord] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutationHooks((data) => UserService.signupUser(data));
  const { data, isPending, isSuccess, isError } = mutation;
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  // useEffect(() => {
  //   if (isSuccess) {
  //     handleNavigateSignUp();
  //     message.success("Đăng ký tài khoản thành công!");
  //   }
  //   if (isError) {
  //     message.error("Tài khoản đã tồn tại! Vui lòng nhập tài khoản khác!");
  //   }
  // }, [isSuccess, isError]);

  useEffect(() => {
    if (data?.status === "OK") {
      message.success("Đăng ký tài khoản thành công!");
      navigate("/sign-in");
    } else if (data?.status === "ERR") {
      message.error(data?.message || "Đăng ký thất bại!");
    }
  }, [data]);

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleNavigateSignUp = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      message.error("Mật khẩu xác nhận không trùng khớp!");
      return;
    }
    if (!isValidEmail(email)) {
      message.error("Email không hợp lệ!");
      return;
    }
    mutation.mutate({ email, password, confirmPassword });
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
          <p>Đăng ký tài khoản!</p>
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
              style={{ marginBottom: "10px" }}
              type={isShowPassWord ? "text" : "password"}
              value={password}
              onChange={handleOnChangePassword}
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
                cursor: "pointer",
              }}
              onClick={() => setIsShowConfirmPassWord(!isShowConfirmPassWord)}
            >
              {isShowConfirmPassWord ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="confirm password"
              type={isShowConfirmPassWord ? "text" : "password"}
              value={confirmPassword}
              onChange={handleOnChangeConfirmPassword}
            />
          </div>
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
          <Loading isLoading={isPending}>
            <ButtonComponent
              disabled={
                !email.length || !password.length || !confirmPassword.length
              }
              onClick={handleSignUp}
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
              textButton={"Đăng ký"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            />
            {confirmPassword && confirmPassword !== password && (
              <span style={{ color: "red" }}>
                Mật khẩu xác nhận không khớp!
              </span>
            )}
          </Loading>
          <p>
            <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
          </p>
          <p>
            Bạn đã có tài khoản?
            <WrapperTextLight onClick={handleNavigateSignUp}>
              Đăng nhập ngay!
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

export default SignUpPage;
