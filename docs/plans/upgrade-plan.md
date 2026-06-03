# SMART-STORE Upgrade Plan

This document outlines the detailed plan to complete the unfinished features and upgrade the SMART-STORE project. The plan is divided into three distinct phases.

## Phase 1: Core E-commerce Flow (Category & Address Management)

**Goal:** Ensure a seamless core shopping experience and allow administrators to manage the product catalog effectively.

### Track 1.1: Category Management
**Backend:**
- [x] Create `backend/src/controllers/CategoryController.js` (CRUD operations).
- [x] Create `backend/src/services/CategoryService.js` (Business logic for categories).
- [x] Create `backend/src/routes/CategoryRouter.js` and register it in `index.js`.
- [x] Ensure validation middleware exists for creating/updating categories.

**Frontend:**
- [x] Create API hooks in `frontend/src/api/category.api.js` (if not fully implemented).
- [x] Build the `Admin/Categories` page to list, create, edit, and delete categories.
- [x] Add the "Categories" link to the `AdminLayout` sidebar/navigation.

### Track 1.2: Address Book & Checkout Optimization
**Backend:**
- [x] Create `backend/src/controllers/AddressController.js` (CRUD for user addresses).
- [x] Create `backend/src/services/AddressService.js`.
- [x] Create `backend/src/routes/AddressRouter.js` and register it in `index.js`.

**Frontend:**
- [x] Create API hooks in `frontend/src/api/address.api.js`.
- [x] Update `ProfilePage` (`frontend/src/pages/Profile/index.jsx`) to include an "Address Book" tab or section.
- [x] Update `CheckoutPage` (`frontend/src/pages/Checkout/index.jsx`) to allow users to select from their saved addresses instead of manually typing.

---

## Phase 2: Administrative & Marketing Tools (Vouchers & Reviews)

**Goal:** Provide administrators with the necessary tools to run marketing campaigns and moderate user-generated content.

### Track 2.1: Voucher/Coupon Administration
**Backend:**
- [x] Verify `VoucherController` and `VoucherService` have full CRUD capabilities for Admin use (create, update, disable, list all). Add them if missing.

**Frontend:**
- [x] Build the `Admin/Vouchers` page to manage coupons (set name, code, discount, dates, limits).
- [x] Add the "Vouchers" link to the Admin sidebar.

### Track 2.2: Review Moderation
**Backend:**
- [x] Add admin endpoints in `ReviewController` to list all reviews, delete/hide reviews.

**Frontend:**
- [x] Build the `Admin/Reviews` page allowing admins to view all product reviews.
- [x] Add action buttons to delete or hide inappropriate reviews.
- [x] Add the "Reviews" link to the Admin sidebar.

---

## Phase 3: Advanced Features (Live Chat & RBAC)

**Goal:** Elevate the platform's professional feel with real-time customer support and granular access control.

### Track 3.1: Live Chat Integration
**Backend:**
- [x] Implement socket event handlers in `backend/src/config/socket.js` for real-time messaging (join room, send message, receive message).
- [x] Create API endpoints (Controller/Service) to fetch chat history from `ChatModel`.

**Frontend:**
- [x] Build a Floating Chat Widget component for normal users.
- [x] Build the `Admin/Chat` page for admins to respond to active customer chats.

### Track 3.2: Role-Based Access Control (RBAC) UI
**Backend:**
- [x] Create endpoints to list available Roles and assign Roles to Users.

**Frontend:**
- [x] Update `Admin/Users` page to include a dropdown/modal to change a user's role.
- [x] (Optional) Build `Admin/Roles` page to create and manage custom roles and their specific permissions.
