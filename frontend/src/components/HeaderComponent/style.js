import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
  padding: 20px 120px;
  background: rgb(11, 116, 229);
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
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
