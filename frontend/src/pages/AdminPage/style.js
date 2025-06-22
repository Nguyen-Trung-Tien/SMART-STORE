import { Menu } from "antd";
import styled from "styled-components";

export const AdminContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f4f6f8;
  margin-top: 35px;
`;

export const AdminSider = styled(Menu)`
  width: 260px;
  padding-top: 20px;
  border-right: 1px solid #e0e0e0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.03);
  background-color: #ffffff;

  .ant-menu-item {
    font-size: 16px;
    padding: 16px 24px;
    border-radius: 8px;
    margin: 6px 12px;
    transition: all 0.3s ease;
  }

  .ant-menu-item-selected {
    background-color: #1677ff !important;
    color: #ffffff !important;
    font-weight: 600;
  }

  .ant-menu-item:hover {
    background-color: #e6f4ff;
  }
`;

export const AdminContent = styled.div`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background-color: #f9f9f9;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }
`;
