import axios from "axios";

export const getConfig = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_KEY}/payment/config`
  );
  return res.data;
};

// export const getVNpay = async () => {
//   const res = await axios.post(
//     `${process.env.REACT_APP_API_KEY}/payment/VNpay-payment`
//   );
//   return res.data;
// };
// console.log(`${process.env.REACT_APP_API_KEY}/payment/VNpay-payment`);
