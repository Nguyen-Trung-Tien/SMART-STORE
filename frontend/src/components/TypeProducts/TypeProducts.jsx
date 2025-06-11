import React from "react";
import { useNavigate } from "react-router-dom";
import { TypeItem } from "./style";

const TypeProducts = ({ name }) => {
  const navigate = useNavigate();

  const toSlug = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase();

  const handleNavigateType = () => {
    navigate(`/product/${toSlug(name)}`, { state: name });
  };

  return <TypeItem onClick={handleNavigateType}>{name}</TypeItem>;
};

export default TypeProducts;
