import mongoose from "mongoose";

export const { Schema } = mongoose;

export const baseSchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
  },
};

export const normalizeString = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim().replace(/\s+/g, " ");
};

export const slugify = (value) => {
  if (!value || typeof value !== "string") {
    return undefined;
  }

  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
};

export const setSlug = (doc, sourceValue, fallback = "item") => {
  const base = slugify(sourceValue) || fallback;
  doc.slug = base;
};

export const ensureUniqueSlug = async (doc, sourceValue, fallback = "item") => {
  const baseSlug = slugify(sourceValue) || fallback;
  const Model = doc.constructor;
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Model.findOne({
      slug: candidate,
      _id: { $ne: doc._id },
    })
      .select("_id")
      .lean();

    if (!existing) {
      doc.slug = candidate;
      return;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

export const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());

export const isValidPhone = (value) =>
  /^[0-9+()\-\s]{8,20}$/.test(String(value));

export const isValidUrl = (value) => {
  if (!value) {
    return true;
  }

  // Allow relative paths
  if (value.startsWith("/")) {
    return true;
  }

  // Allow data URLs (base64)
  if (value.startsWith("data:")) {
    return true;
  }

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

export const registerModel = (name, schema) =>
  mongoose.models[name] || mongoose.model(name, schema);
