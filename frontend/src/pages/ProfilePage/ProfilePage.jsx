import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Package, Clock, CheckCircle2, XCircle, Camera, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserOrders } from "@/features/orders/hooks/useOrders";
import { Badge } from "@/components/ui/badge";
import { useMutationHooks } from "@/hooks/useMutationHook";
import { authService } from "@/features/auth/services/authService";
import { getBase64 } from "@/utils";
import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const profileSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().optional(),
  city: z.string().optional(),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(6, "Mật khẩu cũ phải có ít nhất 6 ký tự"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export default function ProfilePage() {
  const { user, updateUser: updateStoreUser } = useAuthStore();
  const { data: ordersData, isLoading: isOrdersLoading } = useUserOrders(user?._id);
  const orders = ordersData?.data || [];
  const fileInputRef = useRef(null);

  const profileMutation = useMutationHooks((data) => 
    authService.updateProfile(user?._id, data)
  );

  const passwordMutation = useMutationHooks((data) => 
    authService.updatePassword({ userId: user?._id, ...data })
  );

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        phone: user.phone,
        address: user.address,
        city: user.city,
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = (values) => {
    profileMutation.mutate(values, {
      onSuccess: (response) => {
        if (response.status === "OK") {
          updateStoreUser(response.data);
          toast.success("Cập nhật thông tin thành công!");
        } else {
          toast.error(response.message || "Có lỗi xảy ra");
        }
      },
      onError: () => toast.error("Cập nhật thất bại"),
    });
  };

  const onPasswordSubmit = (values) => {
    passwordMutation.mutate(values, {
      onSuccess: (response) => {
        if (response.status === "OK") {
          passwordForm.reset();
          toast.success("Đổi mật khẩu thành công!");
        } else {
          toast.error(response.message || "Có lỗi xảy ra");
        }
      },
      onError: () => toast.error("Đổi mật khẩu thất bại"),
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await getBase64(file);
      profileMutation.mutate({ avatar: base64 }, {
        onSuccess: (response) => {
          if (response.status === "OK") {
            updateStoreUser(response.data);
            toast.success("Cập nhật ảnh đại diện thành công!");
          }
        }
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Chờ xử lý</Badge>;
      case "Processing": return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Đang giao</Badge>;
      case "Delivered": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Đã giao</Badge>;
      case "Cancelled": return <Badge variant="destructive">Đã hủy</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar Info */}
        <Card className="lg:col-span-1 h-fit sticky top-20">
          <CardHeader className="flex flex-col items-center gap-4 text-center">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-4xl bg-primary text-primary-foreground">{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white h-8 w-8" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange} 
              />
            </div>
            <div>
              <CardTitle className="text-2xl">{user?.name}</CardTitle>
              <Badge variant="secondary" className="mt-2 font-bold">{user?.role?.toUpperCase()}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4 border-t">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Email</span>
                  <span className="text-sm font-medium">{user?.email}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Số điện thoại</span>
                  <span className="text-sm font-medium">{user?.phone || "Chưa cập nhật"}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Địa chỉ</span>
                  <span className="text-sm font-medium">{user?.address ? `${user.address}, ${user.city}` : "Chưa cập nhật"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
              <TabsTrigger value="profile" className="font-bold gap-2">
                <User className="h-4 w-4" /> Hồ sơ
              </TabsTrigger>
              <TabsTrigger value="orders" className="font-bold gap-2">
                <Package className="h-4 w-4" /> Đơn hàng ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="security" className="font-bold gap-2">
                <Lock className="h-4 w-4" /> Bảo mật
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6 focus-visible:ring-0">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle>Chỉnh sửa hồ sơ</CardTitle>
                  <CardDescription>Cập nhật thông tin cá nhân để chúng tôi phục vụ bạn tốt hơn.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Họ và tên</FormLabel>
                              <FormControl>
                                <Input className="h-11" placeholder="Nhập họ tên" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số điện thoại</FormLabel>
                              <FormControl>
                                <Input className="h-11" placeholder="Nhập số điện thoại" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Địa chỉ chi tiết</FormLabel>
                              <FormControl>
                                <Input className="h-11" placeholder="Nhập địa chỉ" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thành phố</FormLabel>
                              <FormControl>
                                <Input className="h-11" placeholder="Nhập thành phố" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          size="lg" 
                          className="px-8 font-bold"
                          disabled={profileMutation.isPending}
                        >
                          {profileMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4 focus-visible:ring-0">
              {isOrdersLoading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))
              ) : orders.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">Bạn chưa có đơn hàng nào</h3>
                  <p className="text-muted-foreground mt-2">Hãy bắt đầu mua sắm để nhận được nhiều ưu đãi hấp dẫn.</p>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order._id} className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all group">
                    <div className="bg-muted/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b">
                      <div className="flex items-center gap-4">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Mã đơn hàng</span>
                            <span className="text-sm font-mono font-bold">#{order._id.slice(-8).toUpperCase()}</span>
                         </div>
                         <div className="h-8 w-px bg-border hidden sm:block" />
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Ngày đặt</span>
                            <span className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         {getStatusBadge(order.status)}
                         <Button variant="ghost" size="sm" className="font-bold underline decoration-primary/30">Chi tiết</Button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center">
                            <img src={item.image} className="h-16 w-16 rounded-lg object-contain bg-white border p-1" />
                            <div className="flex-1">
                               <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                               <p className="text-xs text-muted-foreground">Số lượng: {item.amount}</p>
                            </div>
                            <span className="font-bold text-sm text-primary">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 border-t flex items-center justify-between">
                         <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">Cập nhật lúc: {new Date(order.updatedAt).toLocaleTimeString('vi-VN')}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Tổng thanh toán:</span>
                            <span className="text-xl font-black text-primary">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalPrice)}</span>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="security" className="space-y-6 focus-visible:ring-0">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle>Đổi mật khẩu</CardTitle>
                  <CardDescription>Đảm bảo tài khoản của bạn được bảo mật bằng mật khẩu mạnh.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="oldPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mật khẩu cũ</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mật khẩu mới</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" className="h-11" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" className="h-11" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          size="lg" 
                          className="px-8 font-bold"
                          disabled={passwordMutation.isPending}
                        >
                          {passwordMutation.isPending ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
