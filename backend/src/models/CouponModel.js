import { Schema, baseSchemaOptions, ensureUniqueSlug, normalizeString, registerModel } from "./schemaHelpers.js";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 120,
      set: normalizeString,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed", "shipping"],
      required: true,
      index: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      min: 0,
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    usageLimit: {
      type: Number,
      min: 0,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    perUserLimit: {
      type: Number,
      default: 1,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    stackable: {
      type: Boolean,
      default: false,
    },
    applicableProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    applicableCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    excludedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    excludedCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  baseSchemaOptions
);

couponSchema.index({ slug: 1 }, { unique: true });
couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ startDate: 1, endDate: 1, isActive: 1 });

couponSchema.pre("validate", async function couponPreValidate(next) {
  if (!this.slug || this.isModified("name") || this.isModified("code")) {
    await ensureUniqueSlug(this, this.name || this.code, "coupon");
  }

  if (this.endDate <= this.startDate) {
    return next(new Error("Coupon endDate must be greater than startDate"));
  }

  if (this.type === "percentage" && this.value > 100) {
    return next(new Error("Percentage coupon value cannot exceed 100"));
  }

  return next();
});

const Coupon = registerModel("Coupon", couponSchema);
export default Coupon;
