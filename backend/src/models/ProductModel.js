import {
  Schema,
  baseSchemaOptions,
  ensureUniqueSlug,
  isValidUrl,
  normalizeString,
  registerModel,
} from "./schemaHelpers.js";

const imageAssetSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isValidUrl,
        message: "Image URL must be valid",
      },
    },
    alt: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    publicId: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    width: {
      type: Number,
      min: 0,
    },
    height: {
      type: Number,
      min: 0,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const variationSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      set: normalizeString,
    },
    options: [
      {
        type: String,
        trim: true,
        maxlength: 60,
        set: normalizeString,
      },
    ],
  },
  { _id: false }
);

const variantSchema = new Schema(
  {
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 64,
    },
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    price: {
      type: Number,
      min: 0,
    },
    countInStock: {
      type: Number,
      min: 0,
      default: 0,
      alias: "stock",
    },
    image: {
      type: imageAssetSchema,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 2,
      maxlength: 180,
      set: normalizeString,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 64,
      unique: true,
      sparse: true,
    },
    image: {
      type: String,
      trim: true,
      validate: {
        validator: isValidUrl,
        message: "Product image must be a valid URL",
      },
    },
    thumbnail: {
      type: imageAssetSchema,
      default: null,
    },
    images: {
      type: [imageAssetSchema],
      default: [],
      validate: {
        validator: (images) => images.length <= 12,
        message: "A product can have at most 12 images",
      },
    },
    type: {
      type: String,
      required: [true, "Product type is required"],
      trim: true,
      maxlength: 80,
      set: normalizeString,
      index: true,
    },
    brand: {
      type: String,
      trim: true,
      maxlength: 80,
      set: normalizeString,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      alias: "stock",
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 10000,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    selling: {
      type: Number,
      default: 0,
      min: 0,
    },
    selled: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 40,
        set: normalizeString,
      },
    ],
    searchKeywords: [
      {
        type: String,
        trim: true,
        maxlength: 50,
        set: normalizeString,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived"],
      default: "active",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    variations: {
      type: [variationSchema],
      default: [],
    },
    variants: {
      type: [variantSchema],
      default: [],
    },
    weight: {
      type: Number,
      min: 0,
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  baseSchemaOptions
);

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1, status: 1, createdAt: -1 });
productSchema.index({ categories: 1, status: 1 });
productSchema.index({ price: 1, rating: -1 });
productSchema.index({ name: "text", description: "text", brand: "text", tags: "text", type: "text" });

productSchema.pre("validate", async function productPreValidate(next) {
  if ((!this.slug || this.isModified("name")) && this.name) {
    await ensureUniqueSlug(this, this.name, "product");
  }

  if (!this.thumbnail && this.image) {
    this.thumbnail = {
      url: this.image,
      isPrimary: true,
    };
  }

  if (this.thumbnail?.url) {
    this.image = this.thumbnail.url;
  }

  if (!this.images.length && this.thumbnail?.url) {
    this.images = [
      {
        ...this.thumbnail.toObject?.(),
        isPrimary: true,
      },
    ];
  }

  if (!this.image && this.images.length) {
    const primaryImage = this.images.find((item) => item.isPrimary) || this.images[0];
    this.image = primaryImage.url;
    if (!this.thumbnail) {
      this.thumbnail = primaryImage;
    }
  }

  if (this.category) {
    const categoryIds = new Set(this.categories.map((item) => item.toString()));
    categoryIds.add(this.category.toString());
    this.categories = Array.from(categoryIds);
  }

  if (this.compareAtPrice != null && this.compareAtPrice < this.price) {
    return next(new Error("compareAtPrice must be greater than or equal to price"));
  }

  if (!this.image) {
    return next(new Error("Product requires a primary image"));
  }

  return next();
});

const Product = registerModel("Product", productSchema);
export default Product;
