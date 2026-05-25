import { Collapse } from "antd";
import styled from "styled-components";

export const WrapperDescriptions = styled.div`
  margin-top: 16px;
  width: 100%;
  border-radius: 8px;
  background: #ffffff;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

export const StyledCollapse = styled(Collapse)`
  border-radius: 8px;
  background: #f9fbfd;

  .ant-collapse-item {
    border: none;
    border-radius: 6px;
    margin-bottom: 8px;
    overflow: hidden;
  }

  .ant-collapse-header {
    background: #eaf3ff;
    padding: 10px 16px;
    font-weight: 600;
    color: #0b74e5;
  }

  .ant-collapse-content {
    background: #ffffff;
  }

  .ant-collapse-content-box {
    padding: 12px 16px;
    color: #333;
    font-size: 14px;
    line-height: 1.6;
  }
`;
