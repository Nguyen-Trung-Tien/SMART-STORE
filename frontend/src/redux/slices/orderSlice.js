import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  orderItemsSelected: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paidAt: "",
  isDelivered: false,
  deliveredAt: "",
  isErrorOrder: false,
  isSuccessOrder: false,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state.orderItems.find(
        (item) =>
          item.product === orderItem.product && item.userId === orderItem.userId
      );

      if (itemOrder) {
        const newAmount = itemOrder.amount + orderItem.amount;
        if (newAmount <= itemOrder.countInStock) {
          itemOrder.amount = newAmount;
          state.isSuccessOrder = true;
          state.isErrorOrder = false;
        } else {
          state.isSuccessOrder = false;
          state.isErrorOrder = true;
        }
      } else {
        state.orderItems.push(orderItem);
        state.isSuccessOrder = true;
        state.isErrorOrder = false;
      }
    },
    resetOrder: (state) => {
      state.isSuccessOrder = false;
    },
    increaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state.orderItems.find(
        (item) => item.product === idProduct
      );
      const itemOrderSelected = state.orderItemsSelected.find(
        (item) => item.product === idProduct
      );

      if (itemOrder) itemOrder.amount++;
      if (itemOrderSelected) itemOrderSelected.amount++;
    },

    decreaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state.orderItems.find(
        (item) => item.product === idProduct
      );
      const itemOrderSelected = state.orderItemsSelected.find(
        (item) => item.product === idProduct
      );

      if (itemOrder && itemOrder.amount > 1) itemOrder.amount--; // Hoặc tùy quy định min là 1
      if (itemOrderSelected && itemOrderSelected.amount > 1)
        itemOrderSelected.amount--;
    },

    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state?.orderItems?.filter(
        (item) => item?.product !== idProduct
      );
      state.orderItems = itemOrder;
    },
    removeAllOrderProduct: (state, action) => {
      const { listChecked } = action.payload;
      const itemOrders = state?.orderItems?.filter(
        (item) => !listChecked.includes(item?.product)
      );
      state.orderItems = itemOrders;
    },
    selectedOrder: (state, action) => {
      const { listChecked } = action.payload;
      const orderSelected = [];
      state.orderItems.forEach((order) => {
        if (listChecked.includes(order?.product)) {
          orderSelected.push(order);
        }
      });
      state.orderItemsSelected = orderSelected;
    },
    setOrder: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearOrder: () => initialState,
  },
});

export const {
  addOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeOrderProduct,
  removeAllOrderProduct,
  selectedOrder,
  resetOrder,
  setOrder,
  clearOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
