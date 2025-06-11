import styled from "styled-components";
export const WrapperPage = styled.div`
  background-color: #efefef;
  width: 100%;
  padding: 5px 0;
`;

export const WrapperContainer = styled.div`
  width: 1270px;
  margin: 0 auto;
`;

export const Breadcrumb = styled.h5`
  font-size: 14px;
  margin-bottom: 14px;
  span {
    cursor: pointer;
    font-weight: 600;
    color: #0b74e5;
    &:hover {
      text-decoration: underline;
    }
  }
  strong {
    font-weight: 500;
    color: #333;
  }
`;
