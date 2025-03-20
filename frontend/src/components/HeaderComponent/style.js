import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
  background: rgb(11, 116, 229);
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  width: 1270px;
  padding: 10px 0;
`;
export const WrapperTextHeader = styled.span`
  font-size: 25px;
  color: rgb(255, 255, 255);
  font-weight: bold;
  text-align: left;
`;
export const WrapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: rgb(255, 255, 255);
  gap: 10px;
`;
export const WrapperTextHeaderSmall = styled.span`
  font-size: 12px;
  color: rgb(255, 255, 255);
  white-space: nowrap;
`;

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  &:hover {
    background: rgb(11, 116, 229);
    color: white;
  }
`;
