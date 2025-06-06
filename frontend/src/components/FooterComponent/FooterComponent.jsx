import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import {
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Title } = Typography;

const FooterComponent = () => {
  return (
    <div>
      <div style={{ paddingTop: "10px", backgroundColor: "#f0f0f0" }}>
        <Footer
          style={{
            backgroundColor: "rgb(11, 116, 229)",
            color: "#fff",
            padding: "30px 20px",
          }}
        >
          <Row gutter={[16, 24]} justify="space-between">
            {/* Logo & Store Name */}
            <Col xs={24} sm={12} md={7}>
              <Title level={4} style={{ color: "#fff", margin: 0 }}>
                SMART-STORE
              </Title>
              <Text style={{ color: "#f0f0f0", fontSize: 13 }}>
                Smartphone chính hãng, giá tốt hàng đầu Việt Nam.
              </Text>
              <div style={{ marginTop: 10 }}>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                <Text style={{ color: "#f0f0f0", fontSize: 13 }}>
                  1234/1/2 Tân Chánh Hiệp, Q.12, TP.HCM
                </Text>
              </div>
              <div style={{ marginTop: 5 }}>
                <PhoneOutlined style={{ marginRight: 8 }} />
                <Text style={{ color: "#f0f0f0", fontSize: 13 }}>
                  0909090789
                </Text>
              </div>
            </Col>

            {/* Footer Menu */}
            <Col xs={12} sm={6} md={5}>
              <Text strong style={{ color: "#fff" }}>
                Thông tin
              </Text>
              <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
                <li>
                  <a href="/about" style={{ color: "#f0f0f0", fontSize: 13 }}>
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="/contact" style={{ color: "#f0f0f0", fontSize: 13 }}>
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="/news" style={{ color: "#f0f0f0", fontSize: 13 }}>
                    Tin tức
                  </a>
                </li>
              </ul>
            </Col>

            <Col xs={12} sm={6} md={5}>
              <Text strong style={{ color: "#fff" }}>
                Chính sách
              </Text>
              <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
                <li>
                  <a
                    href="/warranty"
                    style={{ color: "#f0f0f0", fontSize: 13 }}
                  >
                    Bảo hành
                  </a>
                </li>
                <li>
                  <a
                    href="/return-policy"
                    style={{ color: "#f0f0f0", fontSize: 13 }}
                  >
                    Đổi trả
                  </a>
                </li>
                <li>
                  <a
                    href="/payment-guide"
                    style={{ color: "#f0f0f0", fontSize: 13 }}
                  >
                    Hướng dẫn thanh toán
                  </a>
                </li>
              </ul>
            </Col>

            {/* Social Icons */}
            <Col xs={24} sm={24} md={7}>
              <Text strong style={{ color: "#fff" }}>
                Kết nối với SMART-STORE:{" "}
              </Text>
              <Space size="middle" style={{ marginTop: 8 }}>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <FacebookFilled style={{ fontSize: 22, color: "#fff" }} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <InstagramFilled style={{ fontSize: 22, color: "#fff" }} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer">
                  <YoutubeFilled style={{ fontSize: 22, color: "#fff" }} />
                </a>
              </Space>
            </Col>
          </Row>

          {/* Copyright */}
          <div
            style={{
              textAlign: "center",
              marginTop: 24,
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              paddingTop: 12,
            }}
          >
            <Text style={{ color: "#f0f0f0", fontSize: 12 }}>
              © 2025 SMART-STORE. All rights reserved.
            </Text>
          </div>
        </Footer>
      </div>
    </div>
  );
};

export default FooterComponent;
