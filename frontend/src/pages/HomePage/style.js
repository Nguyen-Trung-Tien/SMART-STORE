import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
export const WrapperTypeProducts = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-start;
  border-bottom: 1px solid #e0e0e0;
  height: 44px;
`;

export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover {
    color: #fff;
    cursor: pointer;
    background-color: rgb(10, 104, 255);
    span {
      color: #fff;
    }
    width: 100%;
    align-items: center;
  }
`;

export const WrapperProducts = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
`;
