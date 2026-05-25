import React, { useEffect, useState } from "react";
import {
  WrapperContentProfile,
  WrapperHeader,
  WrapperInput,
  WrapperLabel,
  WrapperUploadFile,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slices/userSlice";
import { Button, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
import InputComponent from "../../components/InputComponent/InputComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [isOpenModalUpdatePassword, steIsOpenModalUpdatePassword] =
    useState(false);
  const user = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [avatar, setAvatar] = useState("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    return UserService.updateUser(id, rests, access_token);
  });

  const { data, isPending, isSuccess, isError } = mutation;

  const [form] = Form.useForm();

  const mutationUpdatePassword = useMutationHooks((data) =>
    UserService.updatePassword(data, user?.access_token)
  );

  const {
    data: dataUpdatePassword,
    isPending: isPendingUpdatePassword,
    isSuccess: isSuccessUpdatePassword,
    isError: isErrorUpdatePassword,
  } = mutationUpdatePassword;

  const handleUpdatePassword = () => {
    mutationUpdatePassword.mutate({
      id: user?.id,
      ...passwordData,
    });
  };

  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
    setCity(user?.city);
  }, [user]);

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      handleGetDetailsUser(user?.id, user?.access_token);
      message.success("Cập nhật thành công");
    } else if (isError) {
      message.error("Cập nhật thất bại");
    }
  }, [isSuccess, isError]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleOnChangeName = (value) => {
    setName(value);
  };
  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnChangePhone = (value) => {
    setPhone(value);
  };
  const handleOnChangeAddress = (value) => {
    setAddress(value);
  };
  const handleOnChangeCity = (value) => {
    setCity(value);
  };

  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  useEffect(() => {
    if (isSuccessUpdatePassword && dataUpdatePassword?.status === "OK") {
      message.success("Cập nhật mật khẩu thành công!");
      steIsOpenModalUpdatePassword(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else if (isErrorUpdatePassword || dataUpdatePassword?.status === "ERR") {
      message.error("Mật khẩu không khớp! Vui lòng thử lại!");
    }
  }, [isSuccessUpdatePassword, isErrorUpdatePassword]);

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      name,
      email,
      phone,
      address,
      city,
      avatar,
      access_token: user?.access_token,
    });
  };
  const handleResetPassword = () => {
    steIsOpenModalUpdatePassword(true);
  };

  const handleCancelUpdatePassword = () => {
    steIsOpenModalUpdatePassword(false);
  };

  const handleOnChangeDetails = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  return (
    <div style={{ width: "1270px ", margin: "0 auto", height: "100%" }}>
      <WrapperHeader>Thông tin của bạn</WrapperHeader>
      <Loading isLoading={isPending}>
        <WrapperContentProfile>
          <WrapperInput>
            <WrapperLabel>ID</WrapperLabel>
            <InputForm
              style={{ width: "600px", marginBottom: "15px" }}
              value={user?.id}
              id="id"
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="name">Name</WrapperLabel>
            <InputForm
              style={{ width: "600px", marginBottom: "15px" }}
              value={name}
              id="name"
              onChange={handleOnChangeName}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="email">Email</WrapperLabel>
            <InputForm
              style={{ width: "600px", marginBottom: "15px" }}
              value={email}
              id="email"
              onChange={handleOnChangeEmail}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="phone">Phone(+84)</WrapperLabel>
            <InputForm
              style={{ width: "600px", marginBottom: "15px" }}
              value={phone}
              id="phone"
              onChange={handleOnChangePhone}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="address">Address</WrapperLabel>
            <InputForm
              style={{ width: "600px", marginBottom: "15px" }}
              value={address}
              id="address"
              onChange={handleOnChangeAddress}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="city">City</WrapperLabel>
            <InputForm
              style={{ width: "600px", marginBottom: "15px" }}
              value={city}
              id="city"
              onChange={handleOnChangeCity}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
            <WrapperUploadFile onChange={handleOnChangeAvatar} maxcount={1}>
              <Button icon={<UploadOutlined />}>Upload Avatar</Button>
            </WrapperUploadFile>
            {avatar && (
              <img
                src={avatar}
                style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                onChange={handleOnChangeAvatar}
                maxcount={1}
                accept=".png,.jpg,.jpeg"
                alt="avatar"
              />
            )}
          </WrapperInput>
          <div style={{ display: "flex", gap: "20px" }}>
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: "40px",
                width: "100px",
                borderRadius: "8px",
                border: "1px solid rgb(11, 116, 229)",
                padding: "4px 6px",
                marginTop: "30px",
              }}
              textButton={"Cập nhật"}
              styleTextButton={{
                color: "rgb(11, 116, 229)",
                fontSize: "15px",
                fontWeight: "700",
              }}
            />
            <ButtonComponent
              onClick={handleResetPassword}
              size={40}
              styleButton={{
                height: "40px",
                width: "150px",
                borderRadius: "8px",
                border: "1px solid rgb(11, 116, 229)",
                padding: "4px 6px",
                marginTop: "30px",
              }}
              textButton={"Cập nhật mật khẩu"}
              styleTextButton={{
                color: "rgb(11, 116, 229)",
                fontSize: "15px",
                fontWeight: "700",
              }}
            />
          </div>
        </WrapperContentProfile>
        <ModalComponent
          title="Cập nhật mật khẩu"
          open={isOpenModalUpdatePassword}
          onCancel={handleCancelUpdatePassword}
          onOk={handleUpdatePassword}
        >
          <Loading isLoading={isPendingUpdatePassword}>
            <Form
              name="basic"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 20 }}
              // onFinish={onUpdateUser}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Old password"
                name="oldPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your old password!",
                  },
                ]}
              >
                <InputComponent
                  value={passwordData.oldPassword}
                  onChange={handleOnChangeDetails}
                  name="oldPassword"
                  type="password"
                />
              </Form.Item>
              <Form.Item
                label="New password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your count new password!",
                  },
                ]}
              >
                <InputComponent
                  value={passwordData.newPassword}
                  onChange={handleOnChangeDetails}
                  name="newPassword"
                  type="password"
                />
              </Form.Item>
              <Form.Item
                label="Confirm password"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your count confirm password!",
                  },
                ]}
              >
                <InputComponent
                  value={passwordData.confirmPassword}
                  onChange={handleOnChangeDetails}
                  name="confirmPassword"
                  type="password"
                />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  );
};

export default ProfilePage;
