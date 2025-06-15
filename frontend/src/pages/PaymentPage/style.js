import { InputNumber, Radio } from "antd";
import styled from "styled-components";

// HEADER
export const WrapperStyleHeader = styled.div`
  background: #fefefe;
  padding: 16px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;

  span {
    color: #222;
    font-size: 16px;
    font-weight: 600;
  }
`;

// LEFT CONTAINER
export const WrapperLeft = styled.div`
  flex: 1;
`;

// ORDER LIST
export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// ORDER ITEM
export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #eaeaea;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
`;

// DISCOUNT PRICE
export const WrapperPriceDiscount = styled.span`
  color: #bbb;
  font-size: 14px;
  text-decoration: line-through;
  margin-left: 8px;
`;

// QUANTITY WRAPPER
export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  width: 96px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
`;

// RIGHT PANEL
export const WrapperRight = styled.div`
  width: 340px;
  margin-left: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

// ORDER INFO
export const WrapperInfo = styled.div`
  padding: 24px 28px;
  border: 1px solid #e4e4e4;
  background: #fafafa;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
`;

// TOTAL WRAPPER
export const WrapperTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  background: #fafafa;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border: 1px solid #e4e4e4;
  border-top: none;
  width: 90%;
`;

// LABEL TEXT
export const Label = styled.span`
  font-size: 17px;
  color: #111;
  font-weight: 700;
`;

// CUSTOMIZED INPUT NUMBER
export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    width: 50px;
    border: none;
    background: transparent;

    .ant-input-number-handler-wrap {
      display: none !important;
    }

    input {
      text-align: center;
      font-size: 15px;
      font-weight: 500;
      background: transparent;
    }
  }
`;

// CUSTOM RADIO GROUP
export const WrapperRadio = styled(Radio.Group)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 24px;
  margin-top: 16px;
  background: #f9fdff;
  border: 1px solid #d5f7ff;
  border-radius: 12px;
  width: 520px;
  font-weight: 500;
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

// <ButtonComponent
//   onClick={() => handleAddOrder()}
//   size={40}
//   styleButton={{
//     background: "linear-gradient(135deg, #ff5757, #ff2e63)",
//     height: "52px",
//     width: "360px",
//     border: "none",
//     borderRadius: "12px",
//     boxShadow: "0 6px 12px rgba(255, 46, 99, 0.25)",
//     transition: "all 0.3s ease",
//     cursor: "pointer",
//   }}
//   textButton={"Đặt hàng"}
//   styleTextButton={{
//     fontWeight: "600",
//     fontSize: "16px",
//     color: "#fff",
//     letterSpacing: "0.3px",
//   }}
// />
