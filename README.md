# 🛒 SMART-STORE | Website Thương Mại Điện Tử Thiết Bị Thông Minh

SMART-STORE là một website thương mại điện tử hiện đại, chuyên cung cấp các thiết bị thông minh, mang lại trải nghiệm mua sắm trực tuyến mượt mà, tiện lợi và an toàn.

Với giao diện trực quan và các tính năng mạnh mẽ, người dùng có thể dễ dàng duyệt sản phẩm, quản lý giỏ hàng và thanh toán nhanh chóng. Hệ thống quản trị cung cấp đầy đủ công cụ để quản lý sản phẩm, đơn hàng và người dùng hiệu quả.

---

## 🌟 Tính Năng Nổi Bật

### 🧑‍💻 Dành cho Người dùng (User)
- **🔐 Tài khoản & Bảo mật:** Đăng ký, đăng nhập, đăng xuất và khôi phục mật khẩu an toàn.  
- **🛍️ Trải nghiệm Mua sắm:** Duyệt sản phẩm theo danh mục, tìm kiếm thông minh và thêm sản phẩm vào giỏ hàng dễ dàng.  
- **💳 Thanh toán Linh hoạt:** Tích hợp các cổng thanh toán phổ biến như VNPay và PayPal.  
- **🚚 Quản lý Đơn hàng:** Theo dõi lịch sử mua hàng và cập nhật trạng thái đơn hàng (chờ xác nhận, đang giao, đã giao).  
- **✅ Xác nhận & Hủy đơn:** Xác nhận đã nhận hàng hoặc hủy đơn khi chưa được xử lý.  

### 👨‍💼 Dành cho Quản trị viên (Admin)
- **📊 Dashboard:** Giao diện quản trị tổng quan với số liệu thống kê về doanh thu, đơn hàng và người dùng mới.  
- **🔧 Quản lý Dữ liệu (CRUD):** Toàn quyền quản lý sản phẩm, danh mục, người dùng, và đơn hàng.  
- **⚙️ Xử lý Đơn hàng:** Cập nhật trạng thái và quản lý chi tiết các đơn đặt hàng từ người dùng.  

---

## 🛠️ Công Nghệ Sử Dụng
- **Backend:** Node.js, Express.js  
- **Frontend:** React.js  
- **Database:** MongoDB  
- **Thanh toán:** API VNPay, PayPal  

---

## 🚀 Hướng Dẫn Cài Đặt và Vận Hành

### Yêu cầu hệ thống
- Node.js (phiên bản 16.x trở lên)  
- npm hoặc yarn  

### Cài đặt
1. **Clone repository về máy:**
```bash
git clone <repository-url>
cd smart-store

2. Cài đặt dependencies Backend:
cd backend
npm install
# hoặc
yarn install
3.Cài đặt dependencies Frontend:
cd ../frontend
npm install
# hoặc
yarn install

Cấu hình biến môi trường:

Tạo file .env trong thư mục backend và frontend.

Sao chép nội dung từ .env.example và điền thông tin cần thiết (DB connection, API keys, ...).

Chạy dự án

Backend: Trong thư mục /backend
npm start
# hoặc
yarn start
Frontend: Trong thư mục /frontend
npm start
# hoặc
yarn start

👤 Tài Khoản Demo
Loại tài khoản	Email	Mật khẩu
User	user@gmail.com
	12345
Admin	admin@gmail.com
	12345
