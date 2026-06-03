import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUpload, getUploadConfig, updateUpload, uploadMultipleFiles, uploadSingleFile } from "@/api/upload.api";
import { queryKeys } from "@/lib/queryKeys";

export function useUploadConfig() {
  return useQuery({
    queryKey: queryKeys.uploads.config,
    queryFn: getUploadConfig,
    staleTime: 300000,
    select: (response) => response?.data || null,
  });
}

export function useUploadSingleFile() {
  return useMutation({
    mutationFn: ({ payload, config } = {}) => uploadSingleFile(payload, config),
  });
}

export function useUploadMultipleFiles() {
  return useMutation({
    mutationFn: ({ payload, config } = {}) => uploadMultipleFiles(payload, config),
  });
}

export function useUpdateUpload() {
  return useMutation({
    mutationFn: ({ payload, config } = {}) => updateUpload(payload, config),
  });
}

export function useDeleteUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUpload,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.uploads.all }),
  });
}
