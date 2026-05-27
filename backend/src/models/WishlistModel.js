import { Schema, baseSchemaOptions, registerModel } from "./schemaHelpers.js";

const wishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    products: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },
  },
  baseSchemaOptions
);

wishlistSchema.index({ updatedAt: -1 });

wishlistSchema.pre("save", function wishlistPreSave(next) {
  const uniqueIds = [...new Set(this.products.map((item) => item.toString()))];
  this.products = uniqueIds;
  return next();
});

const Wishlist = registerModel("Wishlist", wishlistSchema);
export default Wishlist;
