import { Schema, baseSchemaOptions, isValidPhone, isValidUrl, normalizeString, registerModel } from "./schemaHelpers.js";

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    variantSku: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 64,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 64,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
      set: normalizeString,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
      max: 999,
    },
    image: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isValidUrl,
        message: "Order item image must be a valid URL",
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const embeddedAddressSchema = new Schema(
  {
    addressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      default: null,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      set: normalizeString,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isValidPhone,
        message: "Shipping phone is invalid",
      },
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
      set: normalizeString,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      set: normalizeString,
    },
    district: {
      type: String,
      trim: true,
      maxlength: 120,
      set: normalizeString,
    },
    ward: {
      type: String,
      trim: true,
      maxlength: 120,
      set: normalizeString,
    },
    state: {
      type: String,
      trim: true,
      maxlength: 120,
      set: normalizeString,
    },
    country: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "Vietnam",
      set: normalizeString,
    },
    postalCode: {
      type: String,
      trim: true,
      maxlength: 20,
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderItems: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: "Order requires at least one item",
      },
    },
    shippingAddress: {
      type: embeddedAddressSchema,
      required: true,
    },
    billingAddress: {
      type: embeddedAddressSchema,
      default: null,
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded", "partially_refunded"],
      default: "unpaid",
      index: true,
    },
    itemsPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    taxPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "VND",
      uppercase: true,
      trim: true,
      maxlength: 3,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Processing", "Packed", "Shipped", "Delivered", "Cancelled", "Refunded"],
      default: "Pending",
      index: true,
    },
    trackingNumber: {
      type: String,
      trim: true,
      maxlength: 100,
      index: true,
      sparse: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  baseSchemaOptions
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ coupon: 1, createdAt: -1 });

orderSchema.pre("validate", function orderPreValidate(next) {
  if (!this.orderNumber) {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    this.orderNumber = `ORD-${Date.now()}-${random}`;
  }

  if (this.totalPrice < this.itemsPrice + this.shippingPrice + this.taxPrice - this.discountPrice) {
    return next(new Error("totalPrice is lower than the computed order total"));
  }

  return next();
});

orderSchema.pre("save", function orderPreSave(next) {
  if (this.isPaid && !this.paidAt) {
    this.paidAt = new Date();
    this.paymentStatus = "paid";
  }

  if (this.isDelivered && !this.deliveredAt) {
    this.deliveredAt = new Date();
    this.status = "Delivered";
  }

  return next();
});

const Order = registerModel("Order", orderSchema);
export default Order;
