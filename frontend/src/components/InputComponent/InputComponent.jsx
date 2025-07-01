import { Input } from "antd";
import React from "react";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";

const InputComponent = ({
  size,
  placeholder,
  variant,
  textButton,
  style,
  type = "text",
  ...rests
}) => {
  if (type === "password") {
    return (
      <Input.Password
        size={size}
        placeholder={placeholder}
        // textButton={textButton}
        variant={variant}
        style={style}
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
        {...rests}
      />
    );
  }

  return (
    <Input
      size={size}
      placeholder={placeholder}
      variant={variant}
      style={style}
      type={type}
      {...rests}
    />
  );
};

export default InputComponent;
