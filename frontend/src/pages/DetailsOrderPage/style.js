import styled from "styled-components";

export const WrapperHeaderUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const WrapperInfoUser = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #f5f5f5;
  background: #fff;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  padding: 16px 20px;
`;

export const WrapperLabel = styled.div`
  width: 200px;
  align-items: flex-start;
  font-weight: bold;
  &:last-child {
    color: red;
  }
  margin-bottom: 10px;
`;

export const WrapperContentInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
  margin-top: 20px;
  height: 100px;
`;

export const WrapperStyContent = styled.div`
  align-items: flex-start;
  width: 100%;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  border: 1px solid #f5f5f5;
`;

export const WrapperItemLabel = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  margin-top: 10px;
  & :last-child {
    color: red;
  }
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
`;

export const WrapperProduct = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
  margin-top: 10px;
`;

export const WrapperNameProduct = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
`;

export const WrapperItem = styled.div`
  width: 200px;
  font-weight: bold;
  & :last-child {
    color: red;
  }
  font-size: 14px;
`;

export const WrapperAllPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
