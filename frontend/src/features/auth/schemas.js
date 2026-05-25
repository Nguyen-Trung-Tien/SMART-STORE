import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export const productSchema = z.object({
  name: z.string().min(2, "Tên sản phẩm phải có ít nhất 2 ký tự"),
  image: z.string().url("URL hình ảnh không hợp lệ"),
  type: z.string().min(1, "Vui lòng chọn loại sản phẩm"),
  price: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
  countInStock: z.number().int().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  rating: z.number().min(0).max(5),
  description: z.string().optional(),
  discount: z.number().min(0).max(100).optional(),
});
