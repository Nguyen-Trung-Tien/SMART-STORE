import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React from "react";

const ButtonInputSearch = (props) => {
  const {
    placeholder,
    textButton,
    size,
    variant,
    backgroundColorInput = "#fff",
    backgroundColorButton = "rgb(10, 104, 255)",
    colorButton = "#fff",
  } = props;
  return (
    <div style={{ display: "flex" }}>
      <Input
        size={size}
        placeholder={placeholder}
        variant={variant}
        style={{ backgroundColor: backgroundColorInput }}
      />
      <Button
        size={size}
        style={{
          backgroundColor: backgroundColorButton,
          border: !variant && "none",
        }}
        icon={
          <SearchOutlined color={colorButton} style={{ color: colorButton }} />
        }
      >
        <span style={{ color: colorButton }}>{textButton}</span>
      </Button>
    </div>
  );
};

export default ButtonInputSearch;
