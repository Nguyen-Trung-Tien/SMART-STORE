import React from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import moment from "moment";
import { ChartWrapper, Note, Title } from "./styler";

// Styled Components

// Fetch orders
const getAllOrder = async (token) => {
  const res = await OrderService.getAllOrder(token);
  return res;
};

const ResponsiveChartTotal = ({ user }) => {
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getAllOrder(user?.access_token),
    enabled: !!user?.access_token,
  });

  // Tính doanh thu theo tháng
  const doanhThuTheoThang = {};

  orders?.data?.forEach((order) => {
    const month = moment(order.createdAt).month() + 1;
    if (!doanhThuTheoThang[month]) {
      doanhThuTheoThang[month] = order.totalPrice;
    } else {
      doanhThuTheoThang[month] += order.totalPrice;
    }
  });

  // Định dạng data cho LineChart
  const dataChart = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      name: `Tháng ${month}`,
      doanhThu: doanhThuTheoThang[month] || 0,
    };
  });

  return (
    <ChartWrapper>
      <Title>📊 Thống kê doanh thu theo tháng</Title>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={dataChart}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 14 }} />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat("vi-VN").format(value)
            }
          />
          <Tooltip
            formatter={(value) =>
              `${new Intl.NumberFormat("vi-VN").format(value)}₫`
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="doanhThu"
            stroke="#8884d8"
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <Note>💡 Di chuột vào để xem chi tiết doanh thu từng tháng</Note>
    </ChartWrapper>
  );
};

export default ResponsiveChartTotal;
