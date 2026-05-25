import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas";
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
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { authService } from "../services/authService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { syncCart, fetchCart } = useCartStore();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      const user = data.data;
      setAuth(user, data.access_token);
      await syncCart(user._id);
      await fetchCart(user._id);
      toast.success("Chào mừng bạn trở lại!", {
        description: `Đăng nhập thành công với tài khoản ${user.name}`,
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Email hoặc mật khẩu không chính xác");
    },
  });

  function onSubmit(values) {
    mutation.mutate(values);
  }

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardContent className="p-0 space-y-6">
        <div className="space-y-1 text-center scale-90">
           <h1 className="text-2xl font-black tracking-tight italic">Chào mừng trở lại</h1>
           <p className="text-xs text-muted-foreground font-medium">Đăng nhập để tiếp tục khám phá Smart Store</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</FormLabel>
                  <FormControl>
                    <div className="relative group">
                       <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                       <Input 
                          placeholder="name@example.com" 
                          className="pl-9 h-11 rounded-xl bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-sm" 
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
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between px-1">
                     <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Mật khẩu</FormLabel>
                     <Link to="/forgot-password" size="sm" className="text-[9px] font-black text-primary/60 hover:text-primary uppercase tracking-widest transition-colors">Quên mật khẩu?</Link>
                  </div>
                  <FormControl>
                    <div className="relative group">
                       <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                       <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="pl-9 pr-9 h-11 rounded-xl bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-sm" 
                          {...field} 
                       />
                       <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                       >
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                       </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />
            
            <Button 
               type="submit" 
               className="w-full h-11 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all mt-2" 
               disabled={mutation.isPending}
            >
              {mutation.isPending ? "Đang xác thực..." : "Đăng nhập ngay"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>

        <div className="relative py-2">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5 dark:border-white/5" /></div>
           <div className="relative flex justify-center text-[9px] font-black uppercase tracking-widest"><span className="bg-[#FAFAFA] dark:bg-[#050505] px-3 text-muted-foreground/40">Hoặc</span></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
           <Button variant="outline" className="h-10 rounded-xl border-2 font-black text-[8px] uppercase tracking-widest">
              Google
           </Button>
           <Button variant="outline" className="h-10 rounded-xl border-2 font-black text-[8px] uppercase tracking-widest">
              Apple
           </Button>
        </div>

        <div className="text-center">
           <p className="text-[11px] text-muted-foreground font-medium">
              Bạn mới đến Smart Store? {" "}
              <Link to="/register" className="text-primary font-black underline decoration-primary/20 hover:decoration-primary transition-all ml-1">Đăng ký tài khoản</Link>
           </p>
        </div>
      </CardContent>
    </Card>
  );
}
