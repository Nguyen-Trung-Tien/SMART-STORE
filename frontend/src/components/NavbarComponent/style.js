import styled from "styled-components";

export const WrapperLabelText = styled.span`
  color: #38383d;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  display: block;
  border-bottom: 1px solid #ccc;
  padding-bottom: 6px;
`;

export const WrapperTextValue = styled.div`
  color: #38383d;
  font-size: 13px;
  font-weight: 400;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.25s ease, color 0.25s ease;
  cursor: pointer;
  width: fit-content;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

export const WrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

export const WrapperTextPrice = styled.div`
  border-radius: 10px;
  padding: 8px 14px;
  background-color: #eee;
  color: #38383d;
  width: fit-content;
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

export const NavbarWrapper = styled.div`
  width: 240px;
  padding: 20px;
  background-color: #fafafa;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgb(0 0 0 / 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;
