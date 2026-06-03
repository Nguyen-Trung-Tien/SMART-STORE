import mongoose from "mongoose";
import { Schema, baseSchemaOptions, isValidUrl, registerModel } from "./schemaHelpers.js";

const syncProductRating = async (productId) => {
  const [summary] = await mongoose.model("Review").aggregate([
    {
      $match: {
        product: productId,
        status: "published",
      },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  await mongoose.model("Product").findByIdAndUpdate(productId, {
    rating: summary ? Number(summary.avgRating.toFixed(1)) : 0,
    numReviews: summary ? summary.numReviews : 0,
  });
};

const reviewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 140,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 2000,
    },
    images: [
      {
        type: String,
        trim: true,
        validate: {
          validator: isValidUrl,
          message: "Review image must be a valid URL",
        },
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
      index: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "published", "rejected", "hidden"],
      default: "published",
      index: true,
    },
  },
  baseSchemaOptions
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });

reviewSchema.post("save", async function reviewPostSave() {
  await syncProductRating(this.product);
});

reviewSchema.post("findOneAndDelete", async function reviewPostDelete(doc) {
  if (doc?.product) {
    await syncProductRating(doc.product);
  }
});

const Review = registerModel("Review", reviewSchema);
export default Review;
