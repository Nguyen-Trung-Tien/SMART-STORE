import { Schema, baseSchemaOptions, ensureUniqueSlug, isValidEmail, isValidPhone, isValidUrl, normalizeString, registerModel } from "./schemaHelpers.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: 2,
      maxlength: 120,
      set: normalizeString,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: isValidEmail,
        message: "Email address is invalid",
      },
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password hash is required"],
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => !value || isValidPhone(value),
        message: "Phone number is invalid",
      },
    },
    avatar: {
      type: String,
      trim: true,
      validate: {
        validator: isValidUrl,
        message: "Avatar must be a valid URL",
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },
    role: {
      type: String,
      enum: ["User", "Admin", "Manager", "Staff"],
      default: "User",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked", "pending"],
      default: "active",
      index: true,
    },
    permissions: [
      {
        type: String,
        trim: true,
      },
    ],
    address: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    city: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    defaultAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      default: null,
    },
    userId: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    oldPassword: {
      type: String,
      select: false,
    },
    newPassword: {
      type: String,
      select: false,
    },
    resetToken: {
      type: String,
      select: false,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
      select: false,
    },
  },
  baseSchemaOptions
);

userSchema.index({ slug: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1, status: 1, createdAt: -1 });

userSchema.pre("validate", async function userPreValidate(next) {
  if ((!this.slug || this.isModified("name")) && this.name) {
    await ensureUniqueSlug(this, this.name, this.email?.split("@")[0] || "user");
  }

  if (this.isAdmin && this.role === "User") {
    this.role = "Admin";
  }

  if (this.role === "Admin") {
    this.isAdmin = true;
  }

  return next();
});

const User = registerModel("User", userSchema);
export default User;
