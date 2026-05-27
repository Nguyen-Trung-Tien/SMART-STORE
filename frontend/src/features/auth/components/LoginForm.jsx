import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordField } from "@/components/form/PasswordField";
import { routePaths } from "@/config/routes";
import { loginSchema } from "@/features/auth/schemas";
import { authService } from "@/services/auth.service";
import { setCredentials } from "@/store/slices/authSlice";

export function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await authService.login(values);
      dispatch(
        setCredentials({
          accessToken: response.access_token,
          user: response.data,
        })
      );
      toast.success("Welcome back.");
      navigate(location.state?.from?.pathname || routePaths.home, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Login failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">Sign in</p>
        <h1 className="text-3xl font-extrabold">Access your workspace</h1>
        <p className="text-muted-foreground">Secure JWT authentication with silent refresh and guarded routes.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="you@company.com" {...register("email")} />
        </FormField>
        <FormField label="Password" error={errors.password?.message}>
          <PasswordField placeholder="Enter your password" {...register("password")} />
        </FormField>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        New here?{" "}
        <Link to={routePaths.register} className="font-semibold text-primary">
          Create an account
        </Link>
      </p>
    </div>
  );
}
