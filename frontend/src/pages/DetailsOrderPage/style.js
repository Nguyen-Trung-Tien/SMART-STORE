import styled from "styled-components";

export const WrapperHeader = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  padding: 16px 24px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const WrapperHeaderUser = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
`;

export const WrapperInfoUser = styled.div`
  flex: 1;
  min-width: 300px;
  border: 1px solid #e0e0e0;
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const WrapperLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #333;
  background: linear-gradient(90deg, #f0f0f0, #fafafa);
  padding: 8px 12px;
  border-radius: 6px;
`;

export const WrapperContentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-size: 14px;
  color: #555;
`;

export const WrapperStyContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const WrapperItemLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: center;
  padding: 8px 0;
  background: #f9f9f9;
  border-radius: 6px;
`;

export const WrapperProduct = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  border: 1px solid #e0e0e0;
  background: #fafafa;
  padding: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  &:hover {
    background: #f0f8ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;

export const WrapperNameProduct = styled.div`
  display: flex;
  align-items: center;
  flex: 3;
  font-size: 14px;
  font-weight: 500;
  gap: 12px;
`;

export const WrapperItem = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

export const WrapperAllPrice = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #222;
  padding-top: 12px;
  border-top: 1px solid #ddd;
`;
