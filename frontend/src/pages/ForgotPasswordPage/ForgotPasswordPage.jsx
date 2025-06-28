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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f4f4",
        height: "100vh",
      }}
    >
      <Loading isLoading={loading}>
        <div
          style={{
            padding: "40px",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            width: "400px",
            textAlign: "center",
          }}
        >
          <h2>Quên mật khẩu</h2>
          <Input
            placeholder="Nhập email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <Button
            type="primary"
            block
            onClick={handleForgot}
            disabled={!email}
            style={{
              height: 44,
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
