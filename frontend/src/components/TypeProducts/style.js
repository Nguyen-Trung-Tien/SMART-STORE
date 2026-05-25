import styled from "styled-components";

export const TypeItem = styled.div`
  padding: 6px 14px;
  margin: 4px;
  cursor: pointer;
  background-color: #f0f0f0;
  color: #333;
  border-radius: 20px;
  display: inline-block;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1890ff;
    color: white;
  }

  &:active {
    transform: scale(0.97);
  }
`;
