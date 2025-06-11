import { Row } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Header container
export const WrapperHeader = styled(Row)`
  background: #0b74e5;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 12px 30px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  height: 60px;

  @media (max-width: 768px) {
    padding: 10px 16px;
  }
`;

// Logo hoặc text header
export const WrapperTextHeader = styled(Link)`
  font-size: 22px;
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.3s;
  margin-left: 30px;

  &:hover {
    color: #dbeeff;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    font-size: 18px;
  }
`;

// Account / User Section
export const WrapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #ffffff;
  gap: 16px; /* Khoảng cách giữa Account và Cart */
  cursor: pointer;

  /* Xóa margin-right lớn */
  margin-left: 10px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

// Text nhỏ trên header
export const WrapperTextHeaderSmall = styled.span`
  font-size: 13px;
  color: #e0e0e0;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

// Content trong popup (menu dropdown chẳng hạn)
export const WrapperContentPopup = styled.p`
  cursor: pointer;
  margin: 0;
  padding: 8px 16px;
  color: #333;
  font-size: 14px;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #f0f7ff;
    color: #0b74e5;
  }
`;
