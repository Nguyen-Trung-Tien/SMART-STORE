import { SmileOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <Result
      status="404"
      icon={<SmileOutlined />}
      title="Trang này không tồn tại! Vui lòng trở về trang chủ!"
      extra={
        <Button onClick={handleBackHome} type="primary">
          Về trang chủ
        </Button>
      }
    />
  );
};

export default NotFoundPage;
