import { Footer } from "antd/es/layout/layout";
import Title from "antd/es/skeleton/Title";
import styled from "styled-components";

export const WrapperFooter = styled(Footer)`
  background-color: #0b74e5;
  color: #efefef;
  padding: 20px;
  margin-top: 20px;
`;

export const FooterTitle = styled(Title)`
  && {
    color: #fff;
    margin-bottom: 8px;
  }
`;

export const FooterText = styled.a`
  && {
    color: #f0f0f0;
    font-size: 13px;
  }
`;

export const FooterLink = styled.a`
  color: #f0f0f0;
  font-size: 13px;
  display: block;
  margin-bottom: 6px;
  transition: color 0.3s;

  &:hover {
    color: #dbeeff;
  }
`;

export const FooterListTitle = styled.a`
  font-weight: 600;
  color: #fff;
  display: block;
  margin-bottom: 12px;
`;

export const FooterBottom = styled.div`
  text-align: center;
  margin-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 14px;
`;

export const SocialIcon = styled.a`
  font-size: 22px;
  color: #fff;
  margin-right: 16px;

  &:hover {
    color: #dbeeff;
  }
`;
