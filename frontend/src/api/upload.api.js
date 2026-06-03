import { apiClient, publicClient } from "@/api/axios";

export function getUploadConfig() {
  return publicClient.get("/upload/config");
}

export function uploadSingleFile(payload, config = {}) {
  return apiClient.post("/upload/single", payload, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
      ...(config.headers || {}),
    },
  });
}

export function uploadMultipleFiles(payload, config = {}) {
  return apiClient.post("/upload/multiple", payload, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
      ...(config.headers || {}),
    },
  });
}

export function updateUpload(payload, config = {}) {
  return apiClient.put("/upload/update", payload, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
      ...(config.headers || {}),
    },
  });
}

export function deleteUpload(payload) {
  return apiClient.delete("/upload/delete", {
    data: payload,
  });
}

export const uploadApi = {
  getUploadConfig,
  uploadSingleFile,
  uploadMultipleFiles,
  updateUpload,
  deleteUpload,
};
