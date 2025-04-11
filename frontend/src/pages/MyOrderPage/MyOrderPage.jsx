import { useQuery } from "@tanstack/react-query";
import React from "../../services/OrderService";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import * as OrderService from "../../services/OrderService";

const MyOrderPage = () => {
  const user = useSelector((state) => state.user);
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderbyUserId(
      user?.id,
      user?.access_token
    );
    console.log(res);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrder,
    enabled: !!(user?.id && user?.access_token), // Ensure it's a boolean
  });

  const { isPending, data } = queryOrder;
  return (
    <Loading isLoading={isPending}>
      <div style={{ background: "#f5f5fa", width: "100%", height: "100vh" }}>
        My
      </div>
    </Loading>
  );
};

export default MyOrderPage;
