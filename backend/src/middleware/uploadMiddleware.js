import multer from "multer";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    const error = new Error(
      `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`
    );
    error.statusCode = 400;
    return cb(error);
  }

  return cb(null, true);
};

const uploader = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
    files: 10,
  },
  fileFilter,
});

const wrapMulter = (middleware) => (req, res, next) => {
  middleware(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      error.statusCode = error.code === "LIMIT_FILE_SIZE" ? 400 : 422;
      if (error.code === "LIMIT_FILE_SIZE") {
        error.message = `Image size exceeds ${MAX_IMAGE_SIZE / (1024 * 1024)}MB limit`;
      }
    }

    return next(error);
  });
};

export const uploadSingleImage = wrapMulter(uploader.single("image"));
export const uploadMultipleImages = wrapMulter(uploader.array("images", 10));

export const uploadValidationConfig = {
  maxImageSizeBytes: MAX_IMAGE_SIZE,
  allowedMimeTypes: ALLOWED_MIME_TYPES,
};
