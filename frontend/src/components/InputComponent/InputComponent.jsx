import { Input } from "antd";
import React from "react";

const InputComponent = ({ size, placeholder, variant, style, ...rest }) => {
  return (
    <Input
      size={size}
      placeholder={placeholder}
      variant={variant}
      style={style}
      {...rest}
    />
  );
};

export default InputComponent;
