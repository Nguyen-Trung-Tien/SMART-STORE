import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { orderConstant } from "../../constant";
import Loading from "../LoadingComponent/Loading";
import { convertPrice } from "../../utils";
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
  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        name: order?.orderItems?.[0]?.name,
        image: order?.orderItems?.[0]?.image,
        paymentMethod: orderConstant.payment[order?.paymentMethod],
        Paid: order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
        Delivered: order?.isDelivered ? "Đã nhận" : "Chưa nhận",
        totalPrice: convertPrice(order?.totalPrice),
        itemsPrice: convertPrice(order?.itemsPrice),
      };
    });

  const isLoadingAll = isPendingOrders;

  return (
    <div>
      <WrapperHeaderRevenue>Doanh thu</WrapperHeaderRevenue>
      <Loading isLoading={isLoadingAll}>
        <div style={{ width: 200, height: 200 }}>
          <ResponsiveChartTotal />
          <ResponsiveChart data={orders?.data} />
        </div>
      </Loading>
    </div>
  );
};

export default AdminRevenue;
