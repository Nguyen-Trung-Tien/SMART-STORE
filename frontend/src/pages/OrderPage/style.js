import { InputNumber } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
  color: #222;
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 15px;
  text-align: center;
`;

export const WrapperStyleHeader = styled.div`
  background: #fff;
  padding: 12px 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  span {
    color: #242424;
    font-size: 14px;
    font-weight: 500;
  }
`;

export const WrapperStyleHeaderDelivery = styled(WrapperStyleHeader)`
  margin-bottom: 8px;
`;

export const WrapperLeft = styled.div`
  width: 910px;
`;

export const WrapperListOrder = styled.div``;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: #fff;
  margin-top: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
    cursor: pointer;
  }
`;

export const WrapperPriceDiscount = styled.span`
  color: #b0b0b0;
  font-size: 13px;
  text-decoration: line-through;
  margin-left: 6px;
`;

export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  width: 60px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 2px 6px;
`;

export const WrapperRight = styled.div`
  width: 320px;
  margin-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
`;

export const WrapperInfo = styled.div`
  padding: 20px 24px;
  border: 1px solid #eee;
  background: #fff;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  width: 87%;
`;

export const WrapperTotal = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  background: #fff;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  width: 87%;
`;

export const Label = styled.span`
  font-size: 15px;
  color: #000;
  font-weight: 600;
`;

export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    width: 50px;
    border: none;
    text-align: center;

    input {
      padding: 0;
      font-weight: 600;
    }

    .ant-input-number-handler-wrap {
      display: none !important;
    }
  }
`;

export const OrderButton = styled.button`
  background: linear-gradient(135deg, #fe3b4b, #ff5e62);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  padding: 14px 0;
  width: 100%;
  margin-left: 25px;
  border: none;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(255, 91, 102, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  letter-spacing: 0.4px;

  &:hover {
    background: linear-gradient(135deg, #ff5e62, #fe3b4b);
    box-shadow: 0 6px 14px rgba(255, 91, 102, 0.4);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 8px rgba(255, 91, 102, 0.2);
  }
`;
