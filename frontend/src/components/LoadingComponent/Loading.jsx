import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loading = ({ children, isLoading, delay = 300 }) => {
  return (
    <Spin
      spinning={isLoading}
      delay={delay}
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 48,
            top: "50%",
            left: "50%",
          }}
          spin
        />
      }
    >
      {children}
    </Spin>
  );
};

export default Loading;
