import { Steps } from "antd";
import React from "react";

const StepComponent = ({ current = 0, items = [] }) => {
  return (
    <Steps current={current}>
      {items.map(({ title, description }) => (
        <Steps.Step key={title} title={title} description={description} />
      ))}
    </Steps>
  );
};

export default StepComponent;
