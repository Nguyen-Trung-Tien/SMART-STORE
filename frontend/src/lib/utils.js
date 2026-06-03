import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function slugify(value = "") {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createProductSlug(product) {
  return `${slugify(product?.name || "product")}--${product?._id || product?.id || ""}`;
}

export function extractIdFromSlug(slug = "") {
  const match = slug.match(/--([a-f0-9]{24})$/i);
  return match?.[1] || slug;
}
