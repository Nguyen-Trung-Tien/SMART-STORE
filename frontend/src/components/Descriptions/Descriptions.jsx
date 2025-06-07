import React from "react";
import { Collapse } from "antd";

const Descriptions = ({ items, accordion }) => {
  return (
    <div style={{ marginTop: "10px", width: "516px" }}>
      <Collapse accordion={accordion} items={items} />
    </div>
  );
};

export default Descriptions;
