import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const cubicBezier = [0.32, 0.72, 0, 1];

export const statusConfig = {
  All: { label: "Tất cả", color: "bg-primary/10 text-primary" },
  Pending: {
    label: "Chờ xử lý",
    color: "bg-amber-500/10 text-amber-600",
    icon: Clock,
  },
  Processing: {
    label: "Đang xử lý",
    color: "bg-blue-500/10 text-blue-600",
    icon: Package,
  },
  Shipped: {
    label: "Đang giao",
    color: "bg-indigo-500/10 text-indigo-600",
    icon: Truck,
  },
  Delivered: {
    label: "Đã giao",
    color: "bg-emerald-500/10 text-emerald-600",
    icon: CheckCircle2,
  },
  Cancelled: {
    label: "Đã hủy",
    color: "bg-rose-500/10 text-rose-600",
    icon: XCircle,
  },
};
