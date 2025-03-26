import React, { useEffect, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Modal } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import * as ProductService from "../../services/ProductServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { getBase64 } from "../../utils";
import Loading from "../LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [stateProduct, setStateProduct] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    type: "",
    countInStock: "",
  });
  const renderAction = () => {
    return (
      <div>
        <EditOutlined
          style={{ color: "blue", fontSize: "30px", cursor: "pointer" }}
        />
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
        />
      </div>
    );
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Rating",
      dataIndex: "rating",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const mutation = useMutationHooks((data) => {
    const { name, price, description, rating, image, type, countInStock } =
      data;
    const res = ProductService.createProduct({
      name,
      price,
      description,
      rating,
      image,
      type,
      countInStock,
    });
    return res;
  });

  const getAllProduct = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };

  const { data, isPending, isSuccess, isError } = mutation;

  const { isPending: isPendingProducts, data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });
  const dataTable =
    products?.data?.length &&
    products?.data?.map((products) => {
      return { ...products, key: products._id };
    });

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Tạo sản phẩm thành công!");
      handleCancel();
    } else if (isError) {
      message.error("Không thể tạo sản phẩm!");
    }
  }, [isSuccess]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
    });
    form.resetFields();
  };
  const onFinish = () => {
    mutation.mutate(stateProduct);
  };

  const handleOnChangeImage = async ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setStateProduct({
        ...stateProduct,
        image: file.preview,
      });
    } else {
      setStateProduct({
        ...stateProduct,
        image: "",
      });
    }
  };
  const handleOnChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <Button
          style={{
            height: "100px",
            width: "100px",
            borderRadius: "10px",
            borderStyle: "dashed",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isPending={isPendingProducts}
          data={dataTable}
        />
      </div>
      <Modal
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isLoading={isPending}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Name"
              name="Name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProduct.name}
                onChange={handleOnChange}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Type"
              name="Type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <InputComponent
                value={stateProduct.type}
                onChange={handleOnChange}
                name="type"
              />
            </Form.Item>
            <Form.Item
              label="Count inStock"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your count inStock!" },
              ]}
            >
              <InputComponent
                value={stateProduct.countInStock}
                onChange={handleOnChange}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input your price!" }]}
            >
              <InputComponent
                value={stateProduct.price}
                onChange={handleOnChange}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: "Please input your rating!" }]}
            >
              <InputComponent
                value={stateProduct.rating}
                onChange={handleOnChange}
                name="rating"
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input your description!" },
              ]}
            >
              <InputComponent
                value={stateProduct.description}
                onChange={handleOnChange}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: "Please upload an image!" }]}
            >
              <WrapperUploadFile
                fileList={
                  stateProduct?.image ? [{ url: stateProduct.image }] : []
                }
                onChange={handleOnChangeImage}
                maxCount={1}
              >
                <Button>Upload</Button>
                {stateProduct?.image && (
                  <img
                    src={stateProduct?.image}
                    alt="img"
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </Modal>
    </div>
  );
};

export default AdminProduct;
