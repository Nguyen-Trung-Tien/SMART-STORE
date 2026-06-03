import { Schema, baseSchemaOptions, isValidUrl, normalizeString, registerModel } from "./schemaHelpers.js";

const cartItemSchema = new Schema(
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
    amount: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 999,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
      set: normalizeString,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isValidUrl,
        message: "Cart item image must be a valid URL",
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
    selectedOptions: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    cartItems: {
      type: [cartItemSchema],
      default: [],
      validate: {
        validator: (items) => items.length <= 100,
        message: "Cart cannot contain more than 100 lines",
      },
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
    status: {
      type: String,
      enum: ["active", "converted", "abandoned"],
      default: "active",
      index: true,
    },
    totals: {
      itemCount: { type: Number, default: 0, min: 0 },
      subtotal: { type: Number, default: 0, min: 0 },
      discountTotal: { type: Number, default: 0, min: 0 },
      grandTotal: { type: Number, default: 0, min: 0 },
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  baseSchemaOptions
);

cartSchema.index({ updatedAt: -1 });

cartSchema.pre("save", function cartPreSave(next) {
  this.totals.itemCount = this.cartItems.reduce((sum, item) => sum + item.amount, 0);
  this.totals.subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.amount, 0);
  this.totals.discountTotal = this.cartItems.reduce(
    (sum, item) => sum + (item.discount || 0) * item.amount,
    0
  );
  this.totals.grandTotal = Math.max(this.totals.subtotal - this.totals.discountTotal, 0);

  return next();
});

const Cart = registerModel("Cart", cartSchema);
export default Cart;
