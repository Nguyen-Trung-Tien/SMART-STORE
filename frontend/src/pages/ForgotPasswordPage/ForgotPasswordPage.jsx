import React, { useState } from "react";
import { Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/UserServices";
import Loading from "../../components/LoadingComponent/Loading";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async () => {
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.status === "OK") {
        message.success("Đã gửi email khôi phục!");
        navigate("/sign-in");
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
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
          <div
            style={{
              textAlign: "center",
              marginBottom: 32,
              color: "#222",
              fontWeight: 700,
              fontSize: 28,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Quên mật khẩu
          </div>

          <Input
            placeholder="Nhập email để khôi phục mật khẩu..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: "20px", height: "40px" }}
          />
          <Button
            type="primary"
            block
            onClick={handleForgot}
            disabled={!email}
            style={{
              height: 40,
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 8,
              backgroundColor: "#4A6CF7",
              borderColor: "#4A6CF7",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#3B58C8")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#4A6CF7")
            }
          >
            Gửi email khôi phục
          </Button>
        </div>
      </Loading>
    </div>
  );
};

export default ForgotPasswordPage;
