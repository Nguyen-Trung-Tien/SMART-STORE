import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import {
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import {
  FooterBottom,
  FooterLink,
  FooterListTitle,
  FooterText,
  FooterTitle,
  SocialIcon,
} from "./styler";

const { Footer } = Layout;
const { Text, Title } = Typography;

const WrapperFooter = styled(Footer)`
  background-color: #0b74e5;
  color: rgb(239, 239, 239);
  padding: 20px;
  margin-top: 20px;
`;

const FooterComponent = () => {
  return (
    <WrapperFooter>
      <Row gutter={[0, 24]}>
        {/* Logo & Store Name */}
        <Col xs={24} sm={12} md={7}>
          <FooterTitle level={4}>SMART-STORE</FooterTitle>
          <FooterText>
            Smartphone chính hãng, giá tốt hàng đầu Việt Nam.
          </FooterText>
          <div style={{ marginTop: 12 }}>
            <EnvironmentOutlined style={{ marginRight: 8 }} />
            <FooterText>1234/1/2 Tân Chánh Hiệp, Q.12, TP.HCM</FooterText>
          </div>
          <div style={{ marginTop: 6 }}>
            <PhoneOutlined style={{ marginRight: 8 }} />
            <FooterText>0909090789</FooterText>
          </div>
        </Col>

        {/* Footer Menu */}
        <Col xs={12} sm={6} md={5}>
          <FooterListTitle>Thông tin</FooterListTitle>
          <FooterLink href="/about">Giới thiệu</FooterLink>
          <FooterLink href="/contact">Liên hệ</FooterLink>
          <FooterLink href="/news">Tin tức</FooterLink>
        </Col>

        <Col xs={12} sm={6} md={5}>
          <FooterListTitle>Chính sách</FooterListTitle>
          <FooterLink href="/warranty">Bảo hành</FooterLink>
          <FooterLink href="/return-policy">Đổi trả</FooterLink>
          <FooterLink href="/payment-guide">Hướng dẫn thanh toán</FooterLink>
        </Col>

        {/* Social Icons */}
        <Col xs={24} sm={24} md={7}>
          <FooterListTitle>Kết nối với SMART-STORE:</FooterListTitle>
          <Space size="middle" style={{ marginTop: 8, flexWrap: "wrap" }}>
            <SocialIcon
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
            >
              <FacebookFilled />
            </SocialIcon>
            <SocialIcon
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              <InstagramFilled />
            </SocialIcon>
            <SocialIcon
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
            >
              <YoutubeFilled />
            </SocialIcon>
          </Space>
        </Col>
      </Row>

      {/* Copyright */}
      <FooterBottom>
        <FooterText>© 2025 SMART-STORE. All rights reserved.</FooterText>
      </FooterBottom>
    </WrapperFooter>
  );
};

export default FooterComponent;
