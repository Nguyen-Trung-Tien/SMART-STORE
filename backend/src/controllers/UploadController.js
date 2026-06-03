import {
  deleteImageByPublicId,
  uploadImageBuffer,
} from "../config/cloudinary.js";
import { uploadValidationConfig } from "../middleware/uploadMiddleware.js";

const formatCloudinaryImage = (asset) => ({
  url: asset.secure_url,
  publicId: asset.public_id,
  width: asset.width,
  height: asset.height,
});

const uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "ERR",
        message: "Image file is required",
      });
    }

    const result = await uploadImageBuffer(req.file.buffer, {
      folder: req.body.folder || "smart-store",
    });

    return res.status(201).json({
      status: "OK",
      message: "Image uploaded successfully",
      data: formatCloudinaryImage(result),
    });
  } catch (error) {
    return next(error);
  }
};

const uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({
        status: "ERR",
        message: "At least one image file is required",
      });
    }

    const uploads = await Promise.all(
      req.files.map((file) =>
        uploadImageBuffer(file.buffer, {
          folder: req.body.folder || "smart-store",
        })
      )
    );

    return res.status(201).json({
      status: "OK",
      message: "Images uploaded successfully",
      data: uploads.map(formatCloudinaryImage),
    });
  } catch (error) {
    return next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const publicId = req.body.publicId || req.params.publicId;

    if (!publicId) {
      return res.status(400).json({
        status: "ERR",
        message: "publicId is required",
      });
    }

    const result = await deleteImageByPublicId(publicId);

    if (result.result !== "ok") {
      return res.status(404).json({
        status: "ERR",
        message: "Image not found or already deleted",
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "Image deleted successfully",
      data: {
        publicId,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const updateImage = async (req, res, next) => {
  try {
    const oldPublicId = req.body.oldPublicId || req.body.publicId;

    if (!oldPublicId) {
      return res.status(400).json({
        status: "ERR",
        message: "oldPublicId is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "ERR",
        message: "New image file is required",
      });
    }

    const uploadResult = await uploadImageBuffer(req.file.buffer, {
      folder: req.body.folder || "smart-store",
    });

    const deleteResult = await deleteImageByPublicId(oldPublicId);

    return res.status(200).json({
      status: "OK",
      message: "Image updated successfully",
      data: {
        ...formatCloudinaryImage(uploadResult),
        replacedPublicId: oldPublicId,
        previousImageDeleted: deleteResult.result === "ok",
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getUploadConfig = async (_req, res) =>
  res.status(200).json({
    status: "OK",
    message: "SUCCESS",
    data: uploadValidationConfig,
  });

export default {
  uploadSingle,
  uploadMultiple,
  deleteImage,
  updateImage,
  getUploadConfig,
};
