import { axiosJWT } from "./UserServices";

// Thêm sản phẩm vào giỏ
export const addToCart = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_KEY}/cart/addCart`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );

  return res.data;
};

// Lấy giỏ hàng theo user
export const getCartByUser = async (userId, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_KEY}/cart/get-cart/${userId}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

// Cập nhật số lượng sản phẩm
export const updateCartItem = async (
  cartId,
  itemId,
  quantity,
  access_token
) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_KEY}/cart/update-cart/${cartId}/item/${itemId}`,
    { quantity },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

// Xóa sản phẩm khỏi giỏ
export const removeCartItem = async (cartId, itemId, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_KEY}/cart/${cartId}/item/${itemId}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

// Xóa toàn bộ giỏ
export const clearCart = async (userId, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_KEY}/cart/clear/${userId}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
