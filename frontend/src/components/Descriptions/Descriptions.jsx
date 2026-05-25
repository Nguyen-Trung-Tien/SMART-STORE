import React from "react";
import { StyledCollapse, WrapperDescriptions } from "./styler";

const Descriptions = ({ items, accordion }) => {
  return (
    <WrapperDescriptions>
      <StyledCollapse accordion={accordion} items={items} />
    </WrapperDescriptions>
  );
};

export default Descriptions;
