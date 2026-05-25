import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, ShoppingBag, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Tháng 1", total: 4000 },
  { name: "Tháng 2", total: 3000 },
  { name: "Tháng 3", total: 2000 },
  { name: "Tháng 4", total: 2780 },
  { name: "Tháng 5", total: 1890 },
  { name: "Tháng 6", total: 2390 },
];

const stats = [
  { title: "Tổng doanh thu", value: "128.430.000đ", icon: DollarSign, trend: "+12.5%" },
  { title: "Người dùng mới", value: "1,240", icon: Users, trend: "+5.2%" },
  { title: "Đơn hàng", value: "456", icon: ShoppingBag, trend: "+18.1%" },
  { title: "Tỉ lệ chuyển đổi", value: "3.2%", icon: TrendingUp, trend: "+2.4%" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-500 font-medium">{stat.trend} từ tháng trước</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu 6 tháng gần nhất</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}đ`} />
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                itemStyle={{ color: "hsl(var(--primary))" }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
