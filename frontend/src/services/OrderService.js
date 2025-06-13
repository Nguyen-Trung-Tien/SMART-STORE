import { axiosJWT } from "./UserServices";

export const createOrder = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_KEY}/order/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getOrderbyUserId = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_KEY}/order/get-all-order/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getDetailsOrder = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_KEY}/order/get-details-order/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const cancelOrder = async (id, access_token, orderItems) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_KEY}/order/cancel-order/${id}`,
    { data: orderItems },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      data: orderItems,
    }
  );
  return res.data;
};

export const confirmOrder = async (id, access_token, orderItems) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_KEY}/order/confirm/${id}`,
    { data: orderItems },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllOrder = async (access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_KEY}/order/get-all-order`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const updateOrderPaid = async (id, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_KEY}/order/pay/${id}`,
    {},
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const updateOrderDelivered = async (id, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_KEY}/order/deliver/${id}`,
    {},
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
