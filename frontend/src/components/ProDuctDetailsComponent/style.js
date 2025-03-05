import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
  width: 64px;
  height: 64px;
`;

export const WrapperStyleColImage = styled(Col)`
  flex-basis: unset;
  display: flex;
`;

export const WrapperStyLeNameProduct = styled.h1`
  color: rgb(36, 36, 36);
  font-size: 24px;
  font-weight: 300;
  line-height: 32px;
  word-break: break-word;
`;

export const WrapperStyleTextSell = styled.span`
  font-size: 16px;
  line-height: 24px;
  color: rgb(120, 120, 120);
`;

export const WrapperPriceProduct = styled.div`
  background-color: rgb(255, 255, 255);
  border-radius: 4px;
`;

export const WrapperPriceTextProduct = styled.h1`
  font-size: 32px;
  line-height: 40px;
  margin-right: 8px;
  font-weight: 500;
  padding: 10px;
  margin-top: 10px;
`;

export const WrapperAddressProduct = styled.div`
  span.address {
    display: flex;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
    padding: 8px 0px;
    border-bottom: 1px solid rgb(235, 235, 240);
    font-size: 14px;
    line-height: 150%;
    font-weight: 400;
    color: rgb(39, 39, 42);
    gap: 8px;
  }
  span.title-address {
    font-size: 16px;
    font-weight: 500;
  }
  span.change-address {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 4px;
    font-size: 14px;
    font-weight: 400;
    line-height: 150%;
    flex: 1 1 0%;
    min-height: 21px;
  }
`;

export const WrapperQuantityProduct = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 120px;
`;

export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    width: 60px;
    border-top: none;
    border-bottom: none;
    &.ant-input-number-handler-wrap {
      display: none;
    }
  }
`;
