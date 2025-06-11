import React, { useCallback, useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import * as UserService from "../../services/UserServices";
import Loading from "../LoadingComponent/Loading";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useQuery } from "@tanstack/react-query";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";
import { useSelector } from "react-redux";
import { getBase64 } from "../../utils";

const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState("");
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const user = useSelector((state) => state?.user);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const searchInput = useRef(null);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    isAdmin: false,
  });

  const [form] = Form.useForm();

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        avatar: res?.data?.avatar,
        address: res?.data?.address,
        isAdmin: res?.data?.isAdmin,
      });
    }
    setIsPendingUpdate(false);
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (rowSelected) {
      setIsPendingUpdate(true);
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailUser = () => {
    setIsOpenDrawer(true);
  };

  const renderAction = () => {
    return (
      <div>
        <EditOutlined
          style={{
            color: "blue",
            fontSize: "30px",
            cursor: "pointer",
          }}
          onClick={handleDetailUser}
        />
        <DeleteOutlined
          style={{
            color: "red",
            fontSize: "30px",
            cursor: "pointer",
            paddingLeft: "15px",
          }}
          onClick={() => setIsModalOpenDelete(true)}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={`${selectedKeys[0] || ""}`}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },

    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email - b.email,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      ...getColumnSearchProps("address"),
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      ...getColumnSearchProps("isAdmin"),
      filters: [
        {
          text: "Admin",
          value: "Admin",
        },
        {
          text: "User",
          value: "User",
        },
      ],
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });

  const mutationDeleteMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUser(ids, token);
    return res;
  });

  const getAllUser = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };

  const handleDeleteManyUser = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const {
    data: dataUpdated,
    isPending: isPendingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const {
    data: dataDeleted,
    isPending: isPendingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;

  const {
    data: dataDeletedMany,
    isPending: isPendingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeleteMany;

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUser,
  });

  const { isPending: isPendingUser, data: users } = queryUser;

  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "Admin" : "User",
      };
    });

  const handleCloseDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      address: "",
      isAdmin: false,
    });
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (isSuccessUpdated || isErrorUpdated) {
      const messageText = isSuccessUpdated
        ? "Cập nhật người dùng thành công!"
        : "Không thể cập nhật người dùng!";
      message.success(messageText);
      handleCloseDrawer();
    }
  }, [isSuccessUpdated, isErrorUpdated, handleCloseDrawer]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success("Xóa người dùng thành công!");
    } else if (isErrorDeletedMany) {
      message.error("Không thể xóa người dùng!");
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany, dataDeletedMany]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success("Xóa người dùng thành công!");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error("Không thể xóa người dùng!");
    }
  }, [isSuccessDeleted, isErrorDeleted, dataDeleted]);

  const handleDeleteUser = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleCancelDeleteMany = () => {
    setIsModalOpenDeleteMany(false);
  };

  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setStateUserDetails({
        ...stateUserDetails,
        avatar: file.preview,
      });
    } else {
      setStateUserDetails({
        ...stateUserDetails,
        avatar: "",
      });
    }
  };

  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateUserDetails,
      },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          fileName="Nguoidung"
          handleDeleteMany={handleDeleteManyUser}
          isPending={isPendingUser}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
                fetchGetDetailsUser(record._id);
              },
            };
          }}
        />
      </div>
      <DrawerComponent
        title="Chi tiết người dùng"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Loading isLoading={isPendingUpdate || isPendingUser}>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateUser}
            autoComplete="on"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateUserDetails.name}
                onChange={handleOnChangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <InputComponent
                value={stateUserDetails.email}
                onChange={handleOnChangeDetails}
                name="email"
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Please input your count phone!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnChangeDetails}
                name="phone"
              />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please input your address!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnChangeDetails}
                name="address"
              />
            </Form.Item>

            <Form.Item
              label="Avatar"
              name="avatar"
              rules={[{ required: true, message: "Please upload an Avatar!" }]}
            >
              <WrapperUploadFile
                fileList={
                  stateUserDetails?.image
                    ? [{ url: stateUserDetails.avatar }]
                    : []
                }
                onChange={handleOnChangeAvatarDetails}
                maxCount={1}
              >
                <Button>Upload File</Button>
                {stateUserDetails?.avatar && (
                  <img
                    src={stateUserDetails?.avatar}
                    alt="avatar"
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
              <Loading isLoading={isPendingUpdated}>
                <Button type="primary" htmlType="submit">
                  Apply
                </Button>
              </Loading>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title="Xóa người dùng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <Loading isLoading={isPendingDeleted}>
          <div>Bạn có chắc xóa người dùng này?</div>
        </Loading>
      </ModalComponent>
      <ModalComponent
        title="Xóa người dùng"
        open={isModalOpenDeleteMany}
        onCancel={handleCancelDeleteMany}
        onOk={handleCancelDeleteMany}
      >
        <Loading isLoading={isPendingDeletedMany}>
          <div>Bạn chắc chắn xóa tất cả?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
