import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
  color: #000;
  font-size: 20px;
  margin: 4px 0;
`;

export const WrapperContentProfile = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  width: 600px;
  height: 400px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 10px;
  gap: 3 0px;
`;

export const WrapperLabel = styled.label`
  color: #000;
  font-size: 14px;
  line-height: 30px;
  font-weight: 600;
  width: 70px;
  text-align: left;
`;

export const WrapperInput = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
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
