import { StarFilled } from "@ant-design/icons";
import React from "react";

const Rating = ({ rating }) => {
  if (!rating || rating <= 0) return null;
  const stars = [];

  for (let i = 0; i < Math.floor(rating); i++) {
    stars.push(
      <StarFilled key={i} style={{ color: "#fadb14", fontSize: "14px" }} />
    );
  }

  if (rating % 1 !== 0) {
    stars.push(
      <StarFilled
        key="half"
        style={{
          color: "#fadb14",
          fontSize: "14px",
          clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
        }}
      />
    );
  }

  return <div>{stars}</div>;
};

export default Rating;
