import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Loading from "../LoadingComponent/Loading";
import { WrapperHeaderRevenue } from "./styler";
import ResponsiveChart from "../AdminOrder/ResponsiveChart";
import ResponsiveChartTotal from "./ResponsiveChartTotal";

const AdminRevenue = () => {
  const user = useSelector((state) => state?.user);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

  const { isPending: isPendingOrders, data: orders } = queryOrder;

  return (
    <div>
      <WrapperHeaderRevenue>Doanh thu</WrapperHeaderRevenue>
      <Loading isLoading={isPendingOrders}>
        <div style={{ width: 200, height: 200 }}>
          <ResponsiveChartTotal />
          <ResponsiveChart data={orders?.data} />
        </div>
      </Loading>
    </div>
  );
};

export default AdminRevenue;
