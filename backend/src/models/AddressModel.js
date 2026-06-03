import { Schema, baseSchemaOptions, ensureUniqueSlug, isValidPhone, normalizeString, registerModel } from "./schemaHelpers.js";

const addressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    label: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "Home",
      set: normalizeString,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: [true, "Recipient full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 120,
      set: normalizeString,
    },
    phone: {
      type: String,
      required: [true, "Recipient phone is required"],
      trim: true,
      validate: {
        validator: isValidPhone,
        message: "Recipient phone is invalid",
      },
    },
    addressLine1: {
      type: String,
      required: [true, "Address line 1 is required"],
      trim: true,
      maxlength: 255,
      set: normalizeString,
    },
    addressLine2: {
      type: String,
      trim: true,
      maxlength: 255,
      set: normalizeString,
    },
    ward: {
      type: String,
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
    city: {
      type: String,
      required: [true, "City is required"],
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
      required: [true, "Country is required"],
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
    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    deliveryInstructions: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  baseSchemaOptions
);

addressSchema.index({ user: 1, isDefault: 1 });
addressSchema.index({ user: 1, slug: 1 }, { unique: true });

addressSchema.pre("validate", async function addressPreValidate(next) {
  if (!this.slug || this.isModified("label") || this.isModified("fullName") || this.isModified("city")) {
    await ensureUniqueSlug(this, `${this.label} ${this.fullName} ${this.city}`, "address");
  }

  return next();
});

const Address = registerModel("Address", addressSchema);
export default Address;
