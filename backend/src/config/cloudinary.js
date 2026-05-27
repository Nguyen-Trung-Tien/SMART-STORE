import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const requiredCloudinaryEnv = [
  "CLOUDINARY_NAME",
  "CLOUDINARY_KEY",
  "CLOUDINARY_SECRET",
];

const missingCloudinaryEnv = requiredCloudinaryEnv.filter((key) => !process.env[key]);

if (missingCloudinaryEnv.length) {
  console.warn(
    `Missing Cloudinary environment variables: ${missingCloudinaryEnv.join(", ")}`
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadImageBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "smart-store",
        resource_type: "image",
        overwrite: options.overwrite ?? false,
        public_id: options.publicId,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      }
    );

    stream.end(buffer);
  });

export const deleteImageByPublicId = async (publicId) => {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  return result;
};

export default cloudinary;
