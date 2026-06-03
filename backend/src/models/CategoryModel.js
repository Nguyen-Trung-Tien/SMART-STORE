import { Schema, baseSchemaOptions, ensureUniqueSlug, isValidUrl, normalizeString, registerModel } from "./schemaHelpers.js";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
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
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    image: {
      type: String,
      trim: true,
      validate: {
        validator: isValidUrl,
        message: "Category image must be a valid URL",
      },
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    ancestors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    level: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: 320,
    },
  },
  baseSchemaOptions
);

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parent: 1, isActive: 1, sortOrder: 1 });
categorySchema.index({ name: "text", description: "text" });

categorySchema.pre("validate", async function categoryPreValidate(next) {
  if ((!this.slug || this.isModified("name")) && this.name) {
    await ensureUniqueSlug(this, this.name, "category");
  }

  if (this.parent && this.parent.equals?.(this._id)) {
    return next(new Error("Category cannot be its own parent"));
  }

  return next();
});

const Category = registerModel("Category", categorySchema);
export default Category;
