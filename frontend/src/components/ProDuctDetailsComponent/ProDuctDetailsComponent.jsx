import { Col, Image, Row } from "antd";
import React from "react";
import ImageProduct from "../../assets/testImage.webp";
import ImageSmall from "../../assets/ImageSmall/testSmall.webp";
import { WrapperStyleColImage, WrapperStyleImageSmall } from "./style";
const ProDuctDetailsComponent = () => {
  return (
    <Row style={{ padding: "16px", backgroundColor: "#fff" }}>
      <Col span={10}>
        <Image src={ImageProduct} alt="image Product" preview={false} />
        <Row style={{ marginTop: "12px", justifyContent: "space-between" }}>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={ImageSmall}
              alt="image Small"
              preview={false}
            />
          </WrapperStyleColImage>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={ImageSmall}
              alt="image Small"
              preview={false}
            />
          </WrapperStyleColImage>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={ImageSmall}
              alt="image Small"
              preview={false}
            />
          </WrapperStyleColImage>
        </Row>
      </Col>
      <Col an={12}>col-12</Col>
    </Row>
  );
};

export default ProDuctDetailsComponent;
