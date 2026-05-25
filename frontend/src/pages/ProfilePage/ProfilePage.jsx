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
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Clock, 
  CheckCircle2, 
  Camera, 
  Lock, 
  Heart, 
  Bell, 
  Shield, 
  LogOut,
  ChevronRight,
  Plus,
  CreditCard,
  History,
  Calendar,
  Settings2,
  Trash2,
  Check,
  Star
} from "lucide-react";
import { useUserOrders } from "@/features/orders/hooks/useOrders";
import { Badge } from "@/components/ui/badge";
import { useMutationHooks } from "@/hooks/useMutationHook";
import { authService } from "@/features/auth/services/authService";
import { getBase64 } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const cubicBezier = [0.32, 0.72, 0, 1];

const profileSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().optional(),
  city: z.string().optional(),
});

// --- Sub-components ---

function SidebarItem({ icon: Icon, label, active, onClick, destructive }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group",
        active 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
          : "hover:bg-muted text-muted-foreground hover:text-foreground",
        destructive && "hover:bg-destructive/10 hover:text-destructive"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn("h-4 w-4", active ? "text-primary-foreground" : "group-hover:scale-110 transition-transform")} />
        <span className="text-[13px] font-bold tracking-tight">{label}</span>
      </div>
      {!destructive && <ChevronRight className={cn("h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all", active && "opacity-0")} />}
    </button>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-black tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
    </div>
  );
}

// --- Content Sections ---

function ProfileInfo({ user, profileForm, profileMutation, onProfileSubmit, handleAvatarClick, fileInputRef, handleAvatarChange }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <SectionHeader title="Thông tin cá nhân" subtitle="Quản lý thông tin định danh và liên lạc của bạn." />
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar Card */}
        <Card className="w-full md:w-[280px] bg-white dark:bg-neutral-900 border-black/5 dark:border-white/5 ring-1 ring-black/5 shadow-sm overflow-hidden rounded-2xl">
          <CardContent className="p-8 flex flex-col items-center gap-6">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
               <Avatar className="h-32 w-32 ring-4 ring-muted shadow-2xl transition-transform duration-500 group-hover:scale-105">
                 <AvatarImage src={user?.avatar} />
                 <AvatarFallback className="text-4xl font-black bg-primary text-primary-foreground">{user?.name?.charAt(0)}</AvatarFallback>
               </Avatar>
               <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                 <Camera className="text-white h-8 w-8" />
               </div>
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <div className="text-center space-y-1">
               <h3 className="font-black tracking-tight">{user?.name}</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{user?.role} Member</p>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="flex-1 bg-white dark:bg-neutral-900 border-black/5 dark:border-white/5 ring-1 ring-black/5 shadow-sm rounded-2xl">
          <CardContent className="p-8">
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Họ và tên</FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-xl bg-muted/30 border-none font-medium focus-visible:ring-1 focus-visible:ring-primary/20" {...field} />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Số điện thoại</FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-xl bg-muted/30 border-none font-medium focus-visible:ring-1 focus-visible:ring-primary/20" {...field} />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" size="lg" className="h-12 px-10 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20" disabled={profileMutation.isPending}>
                    {profileMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function AddressesSection() {
  const addresses = [
    { id: 1, type: "Nhà riêng", name: "Nguyễn Văn A", phone: "0901234567", address: "123 Đường ABC, Phường 4, Quận 5, TP. Hồ Chí Minh", isDefault: true },
    { id: 2, type: "Văn phòng", name: "Nguyễn Văn A", phone: "0901234567", address: "Tòa nhà Landmark 81, Bình Thạnh, TP. Hồ Chí Minh", isDefault: false }
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="flex items-end justify-between">
        <SectionHeader title="Địa chỉ đã lưu" subtitle="Quản lý các địa điểm nhận hàng của bạn." />
        <Button size="sm" className="mb-8 rounded-full font-black text-[9px] uppercase tracking-widest gap-2">
           <Plus className="h-3 w-3" /> Thêm địa chỉ mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <Card key={addr.id} className={cn(
            "group relative overflow-hidden bg-white dark:bg-neutral-900 border-black/5 dark:border-white/5 ring-1 transition-all hover:shadow-md rounded-2xl",
            addr.isDefault ? "ring-primary/40 shadow-sm" : "ring-black/5"
          )}>
            <CardContent className="p-6 space-y-4">
               <div className="flex justify-between items-start">
                  <Badge variant={addr.isDefault ? "default" : "outline"} className="rounded-md text-[8px] font-black uppercase tracking-widest px-2 py-0">
                     {addr.type}
                  </Badge>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground"><Settings2 className="h-3.5 w-3.5" /></Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/5 text-destructive/60"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
               </div>
               <div className="space-y-1">
                  <h4 className="text-sm font-black tracking-tight">{addr.name}</h4>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{addr.phone}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-2">{addr.address}</p>
               </div>
               {addr.isDefault && (
                 <div className="flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest">
                    <CheckCircle2 className="h-3 w-3" /> Mặc định
                 </div>
               )}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

// --- Main Page Component ---

export default function ProfilePage() {
  const { user, updateUser: updateStoreUser, clearAuth } = useAuthStore();
  const [activeSection, setActiveSection] = useState("profile");
  const fileInputRef = useRef(null);

  const profileMutation = useMutationHooks((data) => authService.updateProfile(user?._id, data));

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
    },
  });

  const onProfileSubmit = (values) => {
    profileMutation.mutate(values, {
      onSuccess: (response) => {
        if (response.status === "OK") {
          updateStoreUser(response.data);
          toast.success("Cập nhật thông tin thành công!");
        }
      }
    });
  };

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await getBase64(file);
      profileMutation.mutate({ avatar: base64 }, {
        onSuccess: (response) => {
          if (response.status === "OK") updateStoreUser(response.data);
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] pb-24">
      <div className="container max-w-[1280px] mx-auto px-6 py-10 md:py-16">
        
        {/* Header */}
        <div className="mb-12 space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-2">
             <User className="h-3.5 w-3.5" /> Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Tài khoản của tôi</h1>
          <p className="text-sm text-muted-foreground font-medium">Quản lý hồ sơ, đơn hàng và các tùy chọn bảo mật của bạn.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Sidebar - 3 cols */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
             <Card className="bg-white dark:bg-neutral-900 border-black/5 dark:border-white/5 ring-1 ring-black/5 shadow-sm rounded-[2rem] overflow-hidden">
                <CardContent className="p-4 space-y-2">
                   <SidebarItem icon={User} label="Thông tin cá nhân" active={activeSection === "profile"} onClick={() => setActiveSection("profile")} />
                   <SidebarItem icon={History} label="Lịch sử đơn hàng" active={activeSection === "orders"} onClick={() => setActiveSection("orders")} />
                   <SidebarItem icon={Heart} label="Danh sách yêu thích" active={activeSection === "wishlist"} onClick={() => setActiveSection("wishlist")} />
                   <SidebarItem icon={MapPin} label="Địa chỉ đã lưu" active={activeSection === "address"} onClick={() => setActiveSection("address")} />
                   <SidebarItem icon={CreditCard} label="Phương thức thanh toán" active={activeSection === "payment"} onClick={() => setActiveSection("payment")} />
                   <div className="h-px bg-black/5 dark:bg-white/5 my-2 mx-4" />
                   <SidebarItem icon={Shield} label="Bảo mật & Đăng nhập" active={activeSection === "security"} onClick={() => setActiveSection("security")} />
                   <SidebarItem icon={Bell} label="Thông báo" active={activeSection === "notifications"} onClick={() => setActiveSection("notifications")} />
                   <SidebarItem icon={LogOut} label="Đăng xuất" destructive onClick={clearAuth} />
                </CardContent>
             </Card>

             <div className="p-6 rounded-[1.5rem] bg-primary/5 flex flex-col gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Membership</span>
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
                      <Star className="h-4 w-4 fill-current" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[11px] font-black tracking-tight">Thành viên Platinum</span>
                      <span className="text-[9px] font-bold text-muted-foreground">Ưu đãi 5% mỗi đơn hàng</span>
                   </div>
                </div>
             </div>
          </aside>

          {/* Main Content - 9 cols */}
          <main className="lg:col-span-9">
             <AnimatePresence mode="wait">
                {activeSection === "profile" && (
                   <ProfileInfo 
                      key="profile" user={user} profileForm={profileForm} 
                      profileMutation={profileMutation} onProfileSubmit={onProfileSubmit} 
                      handleAvatarClick={handleAvatarClick} fileInputRef={fileInputRef} handleAvatarChange={handleAvatarChange} 
                   />
                )}
                {activeSection === "address" && <AddressesSection key="address" />}
                {activeSection === "orders" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                     <SectionHeader title="Lịch sử mua sắm" subtitle="Xem lại các đơn hàng bạn đã thực hiện." />
                     <div className="p-12 rounded-[2.5rem] bg-white dark:bg-neutral-900 border-2 border-dashed border-black/5 flex flex-col items-center text-center gap-4">
                        <Package className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-sm font-medium text-muted-foreground">Vui lòng xem chi tiết tại trang <Link to="/my-orders" className="text-primary font-black underline">Đơn hàng</Link></p>
                     </div>
                  </motion.div>
                )}
                {/* Other sections can be added here with similar patterns */}
                {!["profile", "address", "orders"].includes(activeSection) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center justify-center text-center gap-4 bg-white dark:bg-neutral-900 rounded-[2rem] border ring-1 ring-black/5">
                     <Settings2 className="h-10 w-10 text-muted-foreground/20 animate-spin-slow" />
                     <h3 className="text-lg font-black tracking-tight">Tính năng đang phát triển</h3>
                     <p className="text-xs text-muted-foreground max-w-[240px]">Chúng tôi đang nỗ lực hoàn thiện trải nghiệm tuyệt vời nhất cho bạn.</p>
                  </motion.div>
                )}
             </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
