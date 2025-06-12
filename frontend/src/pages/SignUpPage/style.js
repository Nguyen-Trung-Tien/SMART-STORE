import styled from "styled-components";

export const WrapperContainerLeft = styled.div`
  flex: 1;
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 12px;
    color: #333;
  }

  p {
    font-size: 14px;
    color: #555;
    margin-bottom: 18px;
  }
`;

export const WrapperContainerRight = styled.div`
  width: 320px;
  background: linear-gradient(to bottom, #e6f0ff, #d0e4ff);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;

  h4 {
    font-size: 18px;
    color: #333;
    margin-top: 12px;
  }

  img {
    border-radius: 50%;
  }
`;

export const WrapperTextLight = styled.span`
  color: #1677ff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  margin-left: 6px;
  transition: color 0.25s;

  &:hover {
    color: #0958d9;
    text-decoration: underline;
  }
`;
