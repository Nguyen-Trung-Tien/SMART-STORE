import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
  width: 200px;
  & img {
    width: 200px;
    height: 200px;
  }
  position: relative;
`;

export const WrapperImageStyle = styled.img`
  top: -1;
  left: -1;
  border-top-left-radius: 3px;
  position: absolute;
  height: 14px !important;
  width: 50px !important;
`;

export const StyleNameProducts = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: rgb(56, 56, 61);
  font-weight: 400;
`;

export const WrapperReportText = styled.div`
  font-size: 11px;
  display: flex;
  align-items: center;
  color: rgb(128, 128, 137);
  margin: 8px 0 0px;
`;
export const WrapperPriceText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: rgb(255, 66, 78);
`;

export const WrapperDiscountText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: rgb(255, 66, 78);
`;

export const WrapperStyleTextSell = styled.span`
  font-size: 16px;
  line-height: 24px;
  color: rgb(120, 120, 120);
`;
