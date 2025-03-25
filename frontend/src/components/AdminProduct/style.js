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
