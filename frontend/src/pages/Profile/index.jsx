import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/features/profile/hooks/useProfile";
import { toast } from "@/components/ui/sonner";
import { setUser } from "@/store/slices/authSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const profileQuery = useProfile(user?._id || user?.id);
  const updateProfile = useUpdateProfile(user?._id || user?.id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    if (profileQuery.data) {
      reset({
        name: profileQuery.data.name || "",
        phone: profileQuery.data.phone || "",
        email: profileQuery.data.email || "",
      });
    }
  }, [profileQuery.data, reset]);

  const onSubmit = async (values) => {
    try {
      const response = await updateProfile.mutateAsync(values);
      dispatch(setUser(response.data));
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Could not update profile.");
    }
  };

  return (
    <div className="space-y-8 page-enter">
      <PageHeader eyebrow="Protected route" title="Profile" description="This form updates the authenticated user through the backend profile endpoint." />
      <Card>
        <CardContent className="p-6">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Name">
              <Input {...register("name")} />
            </FormField>
            <FormField label="Phone">
              <Input {...register("phone")} />
            </FormField>
            <FormField label="Email" className="md:col-span-2">
              <Input type="email" {...register("email")} />
            </FormField>
            <div className="md:col-span-2">
              <Button type="submit" disabled={isSubmitting || updateProfile.isPending}>
                {isSubmitting || updateProfile.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
