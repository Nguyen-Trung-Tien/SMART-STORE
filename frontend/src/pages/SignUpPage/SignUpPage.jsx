import React, { useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import { Image } from "antd";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import imageLogo from "../../assets/ImageSmall/imageTiki.png";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

const SignUpPage = () => {
  const [isShowPassWord, setIsShowPassWord] = useState(false);
  const [isShowConfirmPassWord, setIsShowConfirmPassWord] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#efefef",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin Chào</h1>
          <p>Thông tin đăng nhập của bạn!</p>
          <InputForm
            style={{ marginBottom: "10px" }}
            placeholder="abc@gmail.com"
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
            />
          </div>

          <ButtonComponent
            size={40}
            styleButton={{
              background: "rgb(255, 66, 78)",
              height: "40px",
              width: "100%  ",
              borderRadius: "4px",
              border: "none",
              margin: "26px 0 10px",
            }}
            textButton={"Đăng nhập"}
            styleTextButton={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
            }}
          />
          <p>
            <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
          </p>
          <p>
            Bạn đã có tài khoản?
            <WrapperTextLight>Đăng nhập ngay!</WrapperTextLight>
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
