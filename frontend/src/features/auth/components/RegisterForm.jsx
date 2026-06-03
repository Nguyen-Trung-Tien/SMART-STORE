import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordField } from "@/components/form/PasswordField";
import { routePaths } from "@/config/routes";
import { registerSchema } from "@/features/auth/schemas";
import { authService } from "@/services/auth.service";

export function RegisterForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await authService.register(values);
      toast.success("Account created. You can sign in now.");
      navigate(routePaths.login, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Registration failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">Register</p>
        <h1 className="text-3xl font-extrabold">Create your account</h1>
        <p className="text-muted-foreground">Form validation is powered by React Hook Form and Zod.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Full name" error={errors.name?.message}>
          <Input placeholder="Jane Doe" {...register("name")} />
        </FormField>
        <FormField label="Phone" error={errors.phone?.message}>
          <Input placeholder="+1 202 555 0117" {...register("phone")} />
        </FormField>
        <FormField label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="you@company.com" {...register("email")} />
        </FormField>
        <FormField label="Password" error={errors.password?.message}>
          <PasswordField placeholder="Create a password" {...register("password")} />
        </FormField>
        <FormField label="Confirm password" error={errors.confirmPassword?.message}>
          <PasswordField placeholder="Confirm your password" {...register("confirmPassword")} />
        </FormField>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to={routePaths.login} className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </div>
  );
}
