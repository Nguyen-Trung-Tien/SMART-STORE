import React, { useEffect, useRef, useState } from "react";
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
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    isAdmin: false,
  });

  const getAllUser = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
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

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        address: res?.data?.address,
        avatar: res?.data?.avatar,
        isAdmin: res?.data?.isAdmin,
      });
    }
    setIsPendingUpdate(false);
  };

  const queryUser = useQuery({
    queryKey: ["user"],
    queryFn: getAllUser,
  });

  const { isPending: isPendingUsers, data: users } = queryUser;

  useEffect(() => {
    if (rowSelected && !isOpenDrawer) {
      setIsPendingUpdate(true);
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailUser = () => {
    setIsOpenDrawer(true);
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
        if (visible && searchInput.current) {
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
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      filters: [
        {
          text: "True",
          value: true,
        },
        {
          text: "False",
          value: false,
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

  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "True" : "False",
      };
    });

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("Cập nhật sản phẩm thành công!");
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error("Không thể cập nhật sản phẩm!");
    }
  }, [isSuccessUpdated]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success("Xóa tài khoản thành công!");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error("Không thể xóa tài khoản!");
    }
  }, [isSuccessDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success("Xóa tài khoản thành công!");
      handleCancelDelete();
    } else if (isErrorDeletedMany) {
      message.error("Không thể xóa tài khoản!");
    }
  }, [isSuccessDeleted]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      address: "",
      avatar: "",
      isAdmin: false,
    });
    form.resetFields();
  };

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
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
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
      <Loading isLoading={isPendingUsers}>
        <div style={{ marginTop: "20px" }}>
          <TableComponent
            handleDeleteMany={handleDeleteManyUser}
            columns={columns}
            isPending={isPendingUsers}
            data={dataTable}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setRowSelected(record._id);
                },
              };
            }}
          />
        </div>
      </Loading>
      <DrawerComponent
        title="Chi tiết người dùng"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Loading isLoading={isPendingUpdate || isPendingUpdated}>
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
              rules={[{ required: true, message: "Please upload an avatar!" }]}
            >
              <WrapperUploadFile
                fileList={
                  stateUserDetails?.avatar
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
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title="Xóa tài khoản người dùng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <Loading isLoading={isPendingDeleted}>
          <div>Bạn có chắc xóa người dùng này?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
