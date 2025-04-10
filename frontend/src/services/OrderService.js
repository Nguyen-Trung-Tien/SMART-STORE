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
