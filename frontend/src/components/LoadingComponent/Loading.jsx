import React from "react";
import { Spin } from "antd";

const Loading = ({ children, isLoading, delay = 300 }) => {
  return (
    <Spin spinning={isLoading} delay={delay}>
      {children}
    </Spin>
  );
};

export default Loading;
