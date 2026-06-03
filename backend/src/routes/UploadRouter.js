import express from "express";
import uploadController from "../controllers/UploadController.js";
import {
  uploadMultipleImages,
  uploadSingleImage,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/config", uploadController.getUploadConfig);
router.post("/single", uploadSingleImage, uploadController.uploadSingle);
router.post("/multiple", uploadMultipleImages, uploadController.uploadMultiple);
router.put("/update", uploadSingleImage, uploadController.updateImage);
router.delete("/delete", uploadController.deleteImage);

export default router;
