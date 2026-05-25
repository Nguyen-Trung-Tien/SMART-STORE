import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { authService } from "../services/authService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function RegisterForm() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success("Tuyệt vời! Bạn đã là thành viên.", {
        description: "Vui lòng đăng nhập để bắt đầu trải nghiệm mua sắm.",
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      });
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Đăng ký không thành công. Email này có thể đã tồn tại.");
    },
  });

  function onSubmit(values) {
    mutation.mutate(values);
  }

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardContent className="p-0 space-y-6">
        <div className="space-y-1 text-center scale-90">
           <h1 className="text-2xl font-black tracking-tight italic">Tạo tài khoản mới</h1>
           <p className="text-xs text-muted-foreground font-medium">Bắt đầu hành trình công nghệ cùng Smart Store</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Họ và tên</FormLabel>
                    <FormControl>
                      <div className="relative group">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                         <Input 
                            placeholder="Nguyễn Văn A" 
                            className="pl-9 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-sm" 
                            {...field} 
                         />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</FormLabel>
                    <FormControl>
                      <div className="relative group">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                         <Input 
                            placeholder="name@example.com" 
                            className="pl-9 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-sm" 
                            {...field} 
                         />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative group">
                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                         <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-9 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-sm" 
                            {...field} 
                         />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Xác nhận</FormLabel>
                    <FormControl>
                      <div className="relative group">
                         <Check className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                         <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-9 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-sm" 
                            {...field} 
                         />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Số điện thoại</FormLabel>
                  <FormControl>
                    <div className="relative group">
                       <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                       <Input 
                          placeholder="0901234567" 
                          className="pl-9 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-sm" 
                          {...field} 
                       />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2 px-1 pt-1">
               <div className="h-3.5 w-3.5 rounded border border-primary/20 flex items-center justify-center cursor-pointer">
                  <Check className="h-2 w-2 text-primary" />
               </div>
               <p className="text-[9px] text-muted-foreground font-medium">Tôi đồng ý với <Link to="/terms" className="text-primary hover:underline">Điều khoản</Link> & <Link to="/privacy" className="text-primary hover:underline">Chính sách</Link></p>
            </div>
            
            <Button 
               type="submit" 
               className="w-full h-11 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all mt-2" 
               disabled={mutation.isPending}
            >
              {mutation.isPending ? "Đang tạo tài khoản..." : "Đăng ký thành viên"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>

        <div className="text-center pt-2">
           <p className="text-[11px] text-muted-foreground font-medium">
              Đã có tài khoản? {" "}
              <Link to="/login" className="text-primary font-black underline decoration-primary/20 hover:decoration-primary transition-all ml-1">Đăng nhập ngay</Link>
           </p>
        </div>
      </CardContent>
    </Card>
  );
}
