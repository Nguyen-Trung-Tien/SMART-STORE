import React from "react";
import { WrapperInputStyle } from "./style";

const InputForm = ({
  placeholder = "Nhập text",
  value,
  onChange,
  ...rests
}) => {
  const handleOnChangeInput = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <WrapperInputStyle
      placeholder={placeholder}
      value={value}
      {...rests}
      onChange={handleOnChangeInput}
    />
  );
};

export default InputForm;

// import React from "react";
// import { WrapperInputStyle } from "./style";

// const InputForm = ({ placeholder = "Nhập text", value, onChange, ...rests }) => {
//   const handleOnChangeInput = (e) => {
//     if (onChange) {
//       onChange(e.target.value);
//     }
//   };

//   return (
//     <WrapperInputStyle
//       placeholder={placeholder}
//       value={value}
//       {...rests}
//       onChange={handleOnChangeInput}
//     />
//   );
// };

// export default InputForm;
