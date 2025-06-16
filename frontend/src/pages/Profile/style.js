import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
  color: #222;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
`;

export const WrapperContentProfile = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  width: 500px;
  margin: 10px auto;
  padding: 30px 40px;
  border-radius: 12px;
  background-color: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  gap: 15px;
`;

export const WrapperLabel = styled.label`
  color: #333;
  font-size: 15px;
  font-weight: 600;
  width: 120px;
  text-align: left;
`;

export const WrapperInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
`;

export const WrapperUploadFile = styled(Upload)`
  .ant-upload-select-picture-card {
    width: 50px !important;
    height: 50px !important;
    border-radius: 50% !important;
    overflow: hidden;
    border: 1px dashed #aaa !important;
    transition: all 0.3s;

    &:hover {
      border-color: #1890ff !important;
    }
  }

  .ant-upload-list-item {
    display: none !important;
  }
`;
