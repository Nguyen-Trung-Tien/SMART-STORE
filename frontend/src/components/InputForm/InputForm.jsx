import React, { useState } from "react";
import { WrapperInputStyle } from "./style";

const InputForm = (props) => {
  const { valueInput, setValueInput } = useState("");
  const { placeholder = "Nhập text", ...rests } = props;

  return (
    <WrapperInputStyle
      placeholder={placeholder}
      inputValue={valueInput}
      {...rests}
    />
  );
};

export default InputForm;
