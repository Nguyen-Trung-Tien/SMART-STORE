import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
  width: 210px;
  position: relative;
  background-color: ${(props) => (props.disabled ? "#ccc" : "#fff")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  overflow: hidden;
  border-radius: 6px;

  &:hover {
    transform: scale(1.03);
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  & img {
    width: 100%;
    height: 210px;
    object-fit: cover;
  }
`;

export const WrapperLogoImage = styled.img`
  position: absolute;
  top: 5px;
  left: 5px;
  width: 45px;
  height: 14px;
  border-radius: 3px;
`;

export const StyleNameProducts = styled.div`
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  color: rgb(56, 56, 61);
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const WrapperReportText = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  color: rgb(128, 128, 137);
  margin: 6px 0 4px;
`;

export const WrapperPriceText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #ff424e;
  margin-top: 4px;
`;

export const WrapperDiscountText = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #ff424e;
  color: #fff;
  padding: 2px 6px;
  font-size: 11px;
  border-radius: 3px;
  font-weight: 600;
`;

export const WrapperStyleTextSell = styled.span`
  font-size: 12px;
  color: rgb(120, 120, 120);
`;
