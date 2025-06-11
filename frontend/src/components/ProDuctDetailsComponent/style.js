import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

// Ảnh nhỏ ở dưới
export const WrapperStyleImageSmall = styled(Image)`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ddd;
  transition: all 0.3s;
  &:hover {
    border-color: #0b74e5;
  }
`;

// Cột chứa ảnh
export const WrapperStyleColImage = styled(Col)`
  flex-basis: unset;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// Tên sản phẩm
export const WrapperStyLeNameProduct = styled.h1`
  color: #242424;
  font-size: 26px;
  font-weight: 600;
  line-height: 36px;
  word-break: break-word;
  margin-bottom: 12px;
`;

// Text số lượng đã bán
export const WrapperStyleTextSell = styled.span`
  font-size: 15px;
  line-height: 24px;
  color: #888;
`;

// Box giá sản phẩm
export const WrapperPriceProduct = styled.div`
  background-color: #fafafa;
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

// Giá tiền
export const WrapperPriceTextProduct = styled.h1`
  font-size: 32px;
  line-height: 40px;
  margin: 0;
  font-weight: 700;
  color: #ff424e;
`;

// Khu vực địa chỉ
export const WrapperAddressProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  span.address {
    text-decoration: underline;
    font-size: 14px;
    line-height: 22px;
    font-weight: 500;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 240px;
  }
  span.change-address {
    color: #0b74e5;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Box chọn số lượng
export const WrapperQuantityProduct = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #ddd;
  overflow: hidden;
  width: fit-content;
  padding: 4px 8px;
  background: #fff;
`;

// Input number quantity
export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    width: 50px;
    border: none;
    text-align: center;
    font-size: 14px;
    .ant-input-number-handler-wrap {
      display: none !important;
    }
    .ant-input-number-input {
      text-align: center;
    }
  }
`;

// Text lỗi khi nhập số lượng sai
export const ErrorText = styled.div`
  color: red;
  font-size: 12px;
  font-weight: 600;
  margin-top: 6px;
`;

// Wrapper cho phần thông tin sản phẩm
export const WrapperProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// Wrapper cho cụm ảnh sản phẩm
export const WrapperProductImages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
