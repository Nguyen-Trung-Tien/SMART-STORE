import React, { useState } from "react"; // thêm useState
import { Button, Form, Input, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import * as UserService from "../../services/UserServices";
import Loading from "../../components/LoadingComponent/Loading";

const RestorePage = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await UserService.resetPassword({
        token: token,
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      });
      if (res.status === "OK") {
        message.success("Đổi mật khẩu thành công, hãy đăng nhập lại!");
        navigate("/sign-in");
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Loading isLoading={loading}>
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            padding: "40px 32px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: 32,
              color: "#222",
              fontWeight: 700,
              fontSize: 28,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Khôi Phục Mật Khẩu
          </h2>

          <Form
            name="resetPassword"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Mật khẩu mới"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  height: 44,
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 8,
                  backgroundColor: "#4A6CF7",
                  borderColor: "#4A6CF7",
                }}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Loading>
    </div>
  );
};

export default RestorePage;
