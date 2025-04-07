import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import React from "react";
import {
  WrapperCountOrder,
  WrapperInfo,
  WrapperInputNumber,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperPriceDiscount,
  WrapperRight,
  WrapperStyleHeader,
  WrapperTotal,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

const OrderPage = ({ count = 1 }) => {
  const onChange = () => {};
  const handleChangeCount = () => {};
  const handleOnChangeCheckAll = () => {};
  return (
    <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3>Giỏ hàng</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: "390px" }}>
                <Checkbox onChange={handleOnChangeCheckAll}></Checkbox>
                <span> Tất cả ({count} sản phẩm)</span>
              </span>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined styler={{ cursor: "pointer" }} />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              <WrapperItemOrder>
                <div
                  style={{
                    with: "390px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Checkbox onChange={onChange}></Checkbox>
                  <img
                    src="img"
                    alt="img"
                    style={{ with: "77px", height: "79px", objectFit: "cover" }}
                  />
                  <div>Name sản phẩm </div>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                  <span>
                    <span style={{ fontSize: "13px", color: "#242424" }}>
                      2234
                    </span>
                    <WrapperPriceDiscount>230</WrapperPriceDiscount>
                  </span>
                  <WrapperCountOrder>
                    <button
                      style={{ border: "none", background: "transparent" }}
                    >
                      <MinusOutlined
                        style={{ color: "#000", fontSize: "10px" }}
                      />
                    </button>
                    <WrapperInputNumber
                      onChange={onChange}
                      defaultValue={1}
                    ></WrapperInputNumber>
                    <button
                      style={{ border: "none", background: "transparent" }}
                    >
                      <PlusOutlined
                        style={{ color: "#000", fontSize: "10px" }}
                      />
                    </button>
                  </WrapperCountOrder>
                  <span style={{ color: "rgb(255, 66, 78)", fontSize: "13px" }}>
                    <DeleteOutlined style={{ cursor: "pointer" }} />
                  </span>
                </div>
              </WrapperItemOrder>
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: "100%" }}>
              <WrapperInfo>
                <div
                  styler={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Tạm tính</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  ></span>
                </div>
                <div
                  styler={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Giảm giá</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  ></span>
                </div>
                <div
                  styler={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Thuế</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  ></span>
                </div>
                <div
                  styler={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Phí vận chuyển</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  ></span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{ color: "rgb(254,56,52)", fontSize: "24px" }}
                  ></span>
                  <span style={{ fontSize: "12px", color: "#ccc" }}>
                    (Đã bao gồm VAT)
                  </span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              size={40}
              styleButton={{
                background: "rgb(254,57,69)",
                height: "48px",
                width: "220px",
                border: "none",
                borderRadius: "4px",
              }}
              textButton={"Mua hàng"}
              styleTextButton={{
                fontWeight: "500",
                fontSize: "15px",
                color: "#fff",
              }}
            ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
