import styled from "styled-components";

export const WrapperHeader = styled.h1`
  color: #222;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

export const WrapperContainer = styled.div`
  width: 100%;
  background-color: #f2f2f7;
  font-size: 20px;
  padding-bottom: 20px;
`;

export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 960px;
  margin: 0 auto;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
  }
`;

export const WrapperHeaderItems = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 12px;
  font-size: 14px;
  width: 100%;
`;

export const WrapperStatus = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #eaeaea;
  gap: 6px;
`;

export const WrapperFooterItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  width: 100%;
`;
