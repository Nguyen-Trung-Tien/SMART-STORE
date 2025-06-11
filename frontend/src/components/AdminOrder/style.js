import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
  color: #000;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
`;

export const WrapperUploadFile = styled(Upload)`
  .ant-upload-select-picture-card {
    width: 60px !important;
    height: 60px !important;
    border-radius: 50% !important;
    overflow: hidden;
  }

  .ant-upload-list-item {
    display: none !important;
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ActionIcon = styled.div`
  font-size: 28px;
  cursor: pointer;
  transition: all 0.25s ease;
  color: ${(props) => props.color};

  &:hover {
    transform: scale(1.15);
    opacity: 0.85;
  }
`;

export const IconButton = styled.button`
  background-color: ${(props) => props.bgColor || "#ccc"};
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.85;
    transform: scale(1.1);
  }

  svg {
    color: #fff;
    font-size: 20px;
  }
`;
