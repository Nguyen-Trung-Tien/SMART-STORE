import styled from "styled-components";

export const WrapperHeaderUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const WrapperInfoUser = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #f5f5f5;
  background: #fff;
  padding: 16px 20px;
`;

export const WrapperLabel = styled.div`
  width: 200px;
  font-size: 18px;
  align-items: flex-start;
  font-weight: bold;
  &:last-child {
    color: red;
  }
  margin-bottom: 10px;
`;

export const WrapperContentInfo = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: bold;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 15px;
  margin-top: 20px;
  height: 100px;
`;

export const WrapperStyContent = styled.div`
  align-items: flex-start;
  width: 100%;
  flex-direction: column;
  margin-top: 20px;
  border: 1px solid #f5f5f5;
`;

export const WrapperItemLabel = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 10px;
  margin-left: 15px;
  width: 100%;
`;

export const WrapperProduct = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
  border: 1px solid #f5f5f5;
  background: #fff;
  padding: 16px 20px;
`;

export const WrapperNameProduct = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: bold;
  align-items: flex-start;
  margin-top: 10px;
  width: 100%;
`;

export const WrapperItem = styled.div`
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  align-items: flex-start;
  width: 100%;
`;

export const WrapperAllPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  margin-top: 10px;
`;
