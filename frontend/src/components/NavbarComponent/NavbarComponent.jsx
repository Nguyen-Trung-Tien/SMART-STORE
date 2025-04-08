import React from "react";
import {
  WrapperContent,
  WrapperLabelText,
  WrapperTextPrice,
  WrapperTextValue,
} from "./style";
import { Checkbox, Rate } from "antd";

const NavbarComponent = () => {
  const onChange = () => {};
  const renderContent = (type, options) => {
    switch (type.toLowerCase()) {
      case "text":
        return options.map((option) => {
          return (
            <WrapperTextValue name={option} key={option}>
              {option}
            </WrapperTextValue>
          );
        });
      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onChange={onChange}
          >
            {options.map((option) => {
              return (
                <Checkbox
                  style={{ marginLeft: 0 }}
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        );
      case "star":
        return options.map((option) => {
          return (
            <div
              style={{ display: "flex", gap: "12px", alignItems: "center" }}
              key={option}
            >
              <Rate
                style={{ fontSize: "12px" }}
                name="rating"
                disabled
                defaultValue={option}
              />
              <span>{`từ ${option} sao`}</span>
            </div>
          );
        });
      case "price":
        return options.map((option) => {
          return <WrapperTextPrice key={option}>{option}</WrapperTextPrice>;
        });
      default:
        return {};
    }
  };
  return (
    <div>
      <WrapperLabelText>Label</WrapperLabelText>
      <WrapperContent>
        {renderContent("text", ["TV", "Tu lanh", "May say"])}
      </WrapperContent>
      {/* <WrapperContent>
        {renderContent("checkbox", [
          { value: "a", label: "Di động" },
          { value: "b", label: "Máy tính" },
        ])}
      </WrapperContent> */}
      <WrapperContent style={{ marginTop: "20px" }}>
        {renderContent("star", [1, 2, 3, 4, 5])}
      </WrapperContent>
      <WrapperContent>
        {renderContent("Price", ["dưới 40.000đ", "trên 50.000đ"])}
      </WrapperContent>
    </div>
  );
};

export default NavbarComponent;
