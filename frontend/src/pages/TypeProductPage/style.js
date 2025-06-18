import { Col, Pagination } from "antd";
import styled from "styled-components";

export const WrapperPage = styled.div`
  width: 100%;
  background: #efefef;
  min-height: calc(100vh - 64px);
  padding: 20px 0;
  display: flex;
  justify-content: center;
`;

export const Container = styled.div`
  width: 1270px;
  min-height: 100%;
  display: flex;
  gap: 10px;
`;

export const WrapperNavbar = styled(Col)`
  background: #fff;
  padding: 16px;
  border-radius: 6px;
  margin-top: 20px;
  width: 200px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

export const WrapperProducts = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

export const ContentArea = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 20px;
  flex: 1;
`;

export const StyledPagination = styled(Pagination)`
  margin-top: 10px;
  display: flex !important;
  justify-content: center !important;
`;
