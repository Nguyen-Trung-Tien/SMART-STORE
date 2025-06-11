import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loading = ({ children, isLoading, delay = 300, size = 48 }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size }} spin />;

  return (
    <Spin spinning={isLoading} delay={delay} indicator={antIcon} size={size}>
      {children}
    </Spin>
  );
};

export default Loading;
