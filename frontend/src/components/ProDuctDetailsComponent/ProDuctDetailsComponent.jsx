import { Col, Image, Row } from "antd";
import React from "react";
import ImageProduct from "../../assets/testImage.webp";
import ImageSmall from "../../assets/ImageSmall/testSmall.webp";
import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQuantityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyLeNameProduct,
  WrapperStyleTextSell,
} from "./style";
import { MinusOutlined, PlusOutlined, StarFilled } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ProductDetailsComponent = () => {
  const onChange = () => {};
  return (
    <Row
      style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "4px" }}
    >
      <Col
        span={10}
        style={{ borderRight: "1px solid #e5e5e5", paddingRight: "8px" }}
      >
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
      <Col span={14} style={{ paddingLeft: "10px" }}>
        <WrapperStyLeNameProduct>Kỷ Luật Bản Thân</WrapperStyLeNameProduct>
        <div>
          <StarFilled style={{ color: "#fadb14", fontSize: "18px" }} />
          <StarFilled style={{ color: "#fadb14", fontSize: "18px" }} />
          <StarFilled style={{ color: "#fadb14", fontSize: "18px" }} />
          <StarFilled style={{ color: "#fadb14", fontSize: "18px" }} />
          <WrapperStyleTextSell> | Đã bán 1000+ </WrapperStyleTextSell>
        </div>
        <WrapperPriceProduct>
          <WrapperPriceTextProduct>100.000đ</WrapperPriceTextProduct>
        </WrapperPriceProduct>
        <WrapperAddressProduct>
          <span className="title-address">Thông tin vận chuyển</span>
          <span className="address">
            Giao đến Q. 1, P. Bến Nghé, Hồ Chí Minh
          </span>
          <span className="change-address">Đổi địa chỉ</span>
        </WrapperAddressProduct>
        <div
          style={{
            margin: "10px 0",
            padding: "10px 0",
            borderBottom: "1px solid #e5e5e5",
            borderTop: "1px solid #e5e5e5",
          }}
        >
          <div style={{ marginBottom: "10px" }}>Số lượng</div>
          <WrapperQuantityProduct>
            <button style={{ border: "none", background: "transparent" }}>
              <MinusOutlined
                style={{ color: "#000", fontSize: "20px" }}
                size="14px"
              />
            </button>

            <WrapperInputNumber
              defaultValue={3}
              onChange={onChange}
              size="small"
            />

            <button style={{ border: "none", background: "transparent" }}>
              <PlusOutlined
                style={{ color: "#000", fontSize: "20px" }}
                size="14px"
              />
            </button>
          </WrapperQuantityProduct>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ButtonComponent
            size={40}
            styleButton={{
              background: "rgb(255, 66, 78)",
              height: "40px",
              width: "220px",
              borderRadius: "4px",
              border: "none",
            }}
            textButton={"Chọn mua"}
            styleTextButton={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
            }}
          />
          <ButtonComponent
            size={40}
            styleButton={{
              background: "#fff",
              height: "40px",
              width: "220px",
              borderRadius: "4px",
              border: "1px solid rgb(13, 92, 182)",
            }}
            textButton={"Mua trả sau"}
            styleTextButton={{ color: "rgb(13, 92, 182)", fontSize: "15px" }}
          ></ButtonComponent>
        </div>
      </Col>
    </Row>
  );
};

export default ProductDetailsComponent;
