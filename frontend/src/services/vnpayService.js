import axios from "axios";

const getVNPayPayment = async (amount, orderDescription) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_KEY}/vnpay/create_payment_url`,
    {
      amount,
      orderDescription,
    }
  );
  return res.data;
};

export default getVNPayPayment;
