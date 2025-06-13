import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
  color: #333;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 24px;
`;

export const WrapperUploadFile = styled(Upload)`
  .ant-upload-select-picture-card {
    width: 80px !important;
    height: 80px !important;
    border-radius: 50% !important;
    overflow: hidden;
    border: 2px dashed #1890ff !important;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      border-color: #40a9ff !important;
      background: #e6f7ff;
    }

    svg {
      color: #1890ff;
      font-size: 28px;
    }
  }

  .ant-upload-list-item {
    display: none !important;
  }
`;

export const ActionButton = styled.div`
  background: ${(props) => props.bgcolor || "#f0f0f0"};
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;
