import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, "Name must be at least 2 characters."),
    phone: z.string().min(8, "Phone must be at least 8 digits."),
    confirmPassword: z.string().min(6, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  address: z.string().min(5, "Address is required."),
  city: z.string().min(2, "City is required."),
  phone: z.string().min(8, "Phone is required."),
  email: z.string().email("Valid email is required."),
  paymentMethod: z.enum(["COD", "CARD"], {
    message: "Choose a payment method.",
  }),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters."),
});

export const productSchema = z.object({
  name: z.string().min(3, "Product name is required."),
  type: z.string().min(2, "Type is required."),
  price: z.coerce.number().positive("Price must be positive."),
  countInStock: z.coerce.number().int().nonnegative("Stock cannot be negative."),
  rating: z.coerce.number().min(0).max(5),
  image: z.string().url("Image must be a valid URL."),
  description: z.string().min(10, "Description is required."),
  discount: z.coerce.number().min(0).max(100).default(0),
});
