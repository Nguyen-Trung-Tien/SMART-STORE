import { InputNumber, Radio } from "antd";
import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
  background: #fff;
  padding: 9px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  span {
    color: #242424;
    font-size: 14px;
    font-weight: 500;
  }
`;

export const WrapperContainer = styled.div`
  width: 100%;
`;

export const WrapperValue = styled.div`
  background: #f0f8ff;
  border: 1px solid #c2ffff;
  padding: 10px 14px;
  border-radius: 6px;
  margin-top: 20px;
  font-size: 14px;
  color: #333;
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
`;

export const WrapperPriceDiscount = styled.span`
  color: #999;
  font-size: 13px;
  text-decoration: line-through;
  margin-left: 6px;
`;

export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  width: 90px;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;

  input {
    text-align: center;
    font-size: 14px;
  }
`;

export const WrapperRight = styled.div`
  width: 320px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

export const WrapperInfo = styled.div`
  padding: 16px 20px;
  border: 1px solid #f0f0f0;
  background: #fff;
  border-radius: 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const WrapperItemsOrderInfo = styled.div`
  padding: 16px 20px;
  border: 1px solid #f0f0f0;
  background: #fff;
  border-radius: 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const WrapperTotal = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;

export const Label = styled.span`
  font-size: 14px;
  color: #000;
  font-weight: 600;
`;
