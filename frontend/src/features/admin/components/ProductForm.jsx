import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, ImagePlus, LoaderCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/api/useCategories";
import { useDeleteUpload, useUploadConfig, useUploadSingleFile } from "@/hooks/api/useUpload";
import { productSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";

const PRODUCT_IMAGE_FOLDER = "smart-store/products";
const MAX_GALLERY_IMAGES = 10;

function createImageItem(file) {
  return {
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind: "new",
    file,
    previewUrl: URL.createObjectURL(file),
    progress: 0,
    isUploading: false,
    asset: null,
  };
}

function createExistingItem(asset, index = 0) {
  return {
    id: asset.publicId || asset.url || `existing-${index}`,
    kind: "existing",
    file: null,
    previewUrl: asset.url,
    progress: 100,
    isUploading: false,
    asset: {
      url: asset.url,
      publicId: asset.publicId,
      width: asset.width,
      height: asset.height,
      alt: asset.alt || "",
      isPrimary: Boolean(asset.isPrimary),
    },
  };
}

function normalizeInitialValues(initialValues) {
  return {
    name: initialValues?.name || "",
    type: initialValues?.type || "",
    brand: initialValues?.brand || "",
    category: initialValues?.category?._id || initialValues?.category || "",
    price: initialValues?.price ?? 0,
    compareAtPrice: initialValues?.compareAtPrice ?? "",
    countInStock: initialValues?.countInStock ?? 0,
    status: initialValues?.status || "active",
    isFeatured: Boolean(initialValues?.isFeatured),
    description: initialValues?.description || "",
    shortDescription: initialValues?.shortDescription || "",
    discount: initialValues?.discount ?? 0,
    tags: Array.isArray(initialValues?.tags) ? initialValues.tags.join(", ") : "",
    searchKeywords: Array.isArray(initialValues?.searchKeywords) ? initialValues.searchKeywords.join(", ") : "",
  };
}

function buildInitialMedia(initialValues) {
  const thumbnailAsset = initialValues?.thumbnail?.url
    ? createExistingItem({ ...initialValues.thumbnail, isPrimary: true })
    : initialValues?.image
      ? createExistingItem({ url: initialValues.image, isPrimary: true })
      : null;

  const thumbnailKey = thumbnailAsset?.asset?.publicId || thumbnailAsset?.asset?.url;
  const galleryItems = Array.isArray(initialValues?.images)
    ? initialValues.images
        .filter((asset, index) => {
          const assetKey = asset.publicId || asset.url || `asset-${index}`;
          return thumbnailKey ? assetKey !== thumbnailKey : !asset.isPrimary;
        })
        .map((asset, index) => createExistingItem(asset, index))
    : [];

  return { thumbnailAsset, galleryItems };
}

function formatFileSize(bytes) {
  if (!bytes) {
    return null;
  }

  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

function parseCommaSeparatedValues(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeUploadedAsset(response, isPrimary = false) {
  const asset = response?.data;

  return {
    url: asset?.url,
    publicId: asset?.publicId,
    width: asset?.width,
    height: asset?.height,
    alt: "",
    isPrimary,
  };
}

function moveItem(items, fromIndex, toIndex) {
  if (toIndex < 0 || toIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

function ImagePreviewCard({
  item,
  title,
  canMoveLeft,
  canMoveRight,
  onMoveLeft,
  onMoveRight,
  onRemove,
}) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-background shadow-sm">
      <div className="aspect-square bg-slate-100">
        <img src={item.previewUrl} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">
              {item.kind === "new" ? item.file?.name || "New image" : "Uploaded image"}
            </p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full bg-primary transition-all", item.isUploading && "animate-pulse")}
              style={{ width: `${item.progress || 0}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {item.isUploading ? `Uploading ${Math.round(item.progress || 0)}%` : item.kind === "new" ? "Ready to upload" : "Uploaded"}
          </p>
        </div>

        {onMoveLeft || onMoveRight ? (
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onMoveLeft} disabled={!canMoveLeft}>
              <ArrowLeft className="h-4 w-4" />
              Move left
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onMoveRight} disabled={!canMoveRight}>
              <ArrowRight className="h-4 w-4" />
              Move right
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ProductForm({ initialValues, onSubmit, isSubmitting, submitLabel }) {
  const categoriesQuery = useCategories();
  const uploadConfigQuery = useUploadConfig();
  const uploadSingleFile = useUploadSingleFile();
  const deleteUpload = useDeleteUpload();
  const [{ thumbnailAsset, galleryItems }, setMediaState] = useState(() => buildInitialMedia(initialValues));
  const [removedAssetIds, setRemovedAssetIds] = useState([]);
  const [mediaError, setMediaError] = useState("");
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: normalizeInitialValues(initialValues),
  });

  useEffect(() => {
    reset(normalizeInitialValues(initialValues));
    setMediaState(buildInitialMedia(initialValues));
    setRemovedAssetIds([]);
    setMediaError("");
  }, [initialValues, reset]);

  useEffect(
    () => () => {
      if (thumbnailAsset?.kind === "new") {
        URL.revokeObjectURL(thumbnailAsset.previewUrl);
      }

      galleryItems.forEach((item) => {
        if (item.kind === "new") {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    },
    [galleryItems, thumbnailAsset]
  );

  const isFeatured = watch("isFeatured");
  const uploadConfig = uploadConfigQuery.data?.data || uploadConfigQuery.data || {};
  const categoryOptions = categoriesQuery.data || [];
  const galleryLimitReached = galleryItems.length >= MAX_GALLERY_IMAGES;
  const uploadHint = useMemo(() => {
    const allowed = Array.isArray(uploadConfig.allowedMimeTypes) ? uploadConfig.allowedMimeTypes.join(", ") : "";
    const size = formatFileSize(uploadConfig.maxImageSizeBytes);
    return [allowed ? `Allowed: ${allowed}` : "", size ? `Max ${size}` : ""].filter(Boolean).join(" • ");
  }, [uploadConfig.allowedMimeTypes, uploadConfig.maxImageSizeBytes]);

  const updateThumbnail = (nextThumbnail) => {
    setMediaState((current) => ({
      ...current,
      thumbnailAsset: typeof nextThumbnail === "function" ? nextThumbnail(current.thumbnailAsset) : nextThumbnail,
    }));
    setMediaError("");
  };

  const updateGallery = (updater) => {
    setMediaState((current) => ({
      ...current,
      galleryItems: typeof updater === "function" ? updater(current.galleryItems) : updater,
    }));
    setMediaError("");
  };

  const markRemoved = (item) => {
    if (item?.asset?.publicId) {
      setRemovedAssetIds((current) =>
        current.includes(item.asset.publicId) ? current : [...current, item.asset.publicId]
      );
    }
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (thumbnailAsset?.kind === "new") {
      URL.revokeObjectURL(thumbnailAsset.previewUrl);
    } else {
      markRemoved(thumbnailAsset);
    }

    updateThumbnail(createImageItem(file));
  };

  const handleRemoveThumbnail = () => {
    if (thumbnailAsset?.kind === "new") {
      URL.revokeObjectURL(thumbnailAsset.previewUrl);
    } else {
      markRemoved(thumbnailAsset);
    }

    updateThumbnail(null);
  };

  const handleGalleryChange = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) {
      return;
    }

    updateGallery((current) => {
      const remainingSlots = MAX_GALLERY_IMAGES - current.length;
      return [...current, ...files.slice(0, remainingSlots).map(createImageItem)];
    });
  };

  const handleRemoveGalleryItem = (itemId) => {
    updateGallery((current) => {
      const item = current.find((entry) => entry.id === itemId);
      if (!item) {
        return current;
      }

      if (item.kind === "new") {
        URL.revokeObjectURL(item.previewUrl);
      } else {
        markRemoved(item);
      }

      return current.filter((entry) => entry.id !== itemId);
    });
  };

  const uploadImageItem = async (item, isPrimary = false) => {
    if (item.kind === "existing" && item.asset?.url) {
      return item.asset;
    }

    const formData = new FormData();
    formData.append("image", item.file);
    formData.append("folder", PRODUCT_IMAGE_FOLDER);

    const setProgress = (progress, uploading) => {
      if (isPrimary) {
        updateThumbnail((current) =>
          current?.id === item.id
            ? {
                ...current,
                progress,
                isUploading: uploading,
              }
            : current
        );
        return;
      }

      updateGallery((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                progress,
                isUploading: uploading,
              }
            : entry
        )
      );
    };

    setProgress(0, true);

    const response = await uploadSingleFile.mutateAsync({
      payload: formData,
      config: {
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || item.file?.size || 1;
          const percent = Math.min(Math.round((progressEvent.loaded / total) * 100), 100);
          setProgress(percent, true);
        },
      },
    });

    const asset = normalizeUploadedAsset(response, isPrimary);
    setProgress(100, false);
    return asset;
  };

  const submitForm = async (values) => {
    if (!thumbnailAsset) {
      setMediaError("A thumbnail image is required.");
      return;
    }

    setIsProcessingMedia(true);
    setMediaError("");

    const uploadedAssetIds = [];

    try {
      const uploadedThumbnail = await uploadImageItem(thumbnailAsset, true);
      if (uploadedThumbnail?.publicId && thumbnailAsset.kind === "new") {
        uploadedAssetIds.push(uploadedThumbnail.publicId);
      }

      const uploadedGallery = [];
      for (let index = 0; index < galleryItems.length; index += 1) {
        const item = galleryItems[index];
        const asset = await uploadImageItem(item, false);
        uploadedGallery.push({
          ...asset,
          isPrimary: false,
        });

        if (asset?.publicId && item.kind === "new") {
          uploadedAssetIds.push(asset.publicId);
        }
      }

      const payload = {
        ...values,
        category: values.category || "",
        compareAtPrice: values.compareAtPrice ?? undefined,
        tags: parseCommaSeparatedValues(values.tags),
        searchKeywords: parseCommaSeparatedValues(values.searchKeywords),
        image: uploadedThumbnail.url,
        thumbnail: {
          ...uploadedThumbnail,
          isPrimary: true,
        },
        images: [
          {
            ...uploadedThumbnail,
            isPrimary: true,
          },
          ...uploadedGallery,
        ],
      };

      await onSubmit(payload);

      if (removedAssetIds.length) {
        await Promise.allSettled(removedAssetIds.map((publicId) => deleteUpload.mutateAsync({ publicId })));
      }
    } catch (error) {
      if (uploadedAssetIds.length) {
        await Promise.allSettled(uploadedAssetIds.map((publicId) => deleteUpload.mutateAsync({ publicId })));
      }

      throw error;
    } finally {
      setIsProcessingMedia(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit(submitForm)}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Product name" error={errors.name?.message} className="md:col-span-2">
          <Input {...register("name")} />
        </FormField>
        <FormField label="Type" error={errors.type?.message}>
          <Input {...register("type")} />
        </FormField>
        <FormField label="Brand" error={errors.brand?.message}>
          <Input {...register("brand")} />
        </FormField>
        <FormField label="Category" error={errors.category?.message}>
          <Select
            value={watch("category") || "__none__"}
            onValueChange={(value) => setValue("category", value === "__none__" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">No category</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Status" error={errors.status?.message}>
          <Select value={watch("status")} onValueChange={(value) => setValue("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Price" error={errors.price?.message}>
          <Input type="number" min="0" step="0.01" {...register("price")} />
        </FormField>
        <FormField label="Compare-at price" error={errors.compareAtPrice?.message}>
          <Input type="number" min="0" step="0.01" {...register("compareAtPrice")} />
        </FormField>
        <FormField label="Stock" error={errors.countInStock?.message}>
          <Input type="number" min="0" {...register("countInStock")} />
        </FormField>
        <FormField label="Discount (%)" error={errors.discount?.message}>
          <Input type="number" min="0" max="100" {...register("discount")} />
        </FormField>
        <FormField label="Short description" error={errors.shortDescription?.message} className="md:col-span-2">
          <textarea
            className="min-h-24 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
            {...register("shortDescription")}
          />
        </FormField>
        <FormField label="Description" error={errors.description?.message} className="md:col-span-2">
          <textarea
            className="min-h-36 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
            {...register("description")}
          />
        </FormField>
        <FormField label="Tags" error={errors.tags?.message} description="Comma-separated values">
          <Input {...register("tags")} placeholder="summer, sale, cotton" />
        </FormField>
        <FormField
          label="Search keywords"
          error={errors.searchKeywords?.message}
          description="Comma-separated values"
        >
          <Input {...register("searchKeywords")} placeholder="shirt, oversized, basic tee" />
        </FormField>
        <label className="flex items-center gap-3 rounded-2xl border px-4 py-3 md:col-span-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={isFeatured}
            onChange={(event) => setValue("isFeatured", event.target.checked)}
          />
          <span className="text-sm font-medium">Feature this product in curated sections</span>
        </label>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,360px),1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Thumbnail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {thumbnailAsset ? (
              <ImagePreviewCard item={thumbnailAsset} title="Primary thumbnail" onRemove={handleRemoveThumbnail} />
            ) : (
              <label className="flex min-h-72 cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed bg-slate-50 p-6 text-center">
                <ImagePlus className="h-10 w-10 text-slate-400" />
                <div className="space-y-1">
                  <p className="font-semibold">Upload thumbnail</p>
                  <p className="text-sm text-muted-foreground">{uploadHint || "Choose a product cover image."}</p>
                </div>
                <Input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
              </label>
            )}

            {thumbnailAsset ? (
              <label className="block">
                <Input type="file" accept="image/*" onChange={handleThumbnailChange} />
              </label>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Upload multiple gallery images</p>
                <p className="text-sm text-muted-foreground">
                  Preview, remove, and reorder before saving. Up to {MAX_GALLERY_IMAGES} gallery images.
                </p>
              </div>
              <label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  disabled={galleryLimitReached}
                />
              </label>
            </div>

            {galleryItems.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {galleryItems.map((item, index) => (
                  <ImagePreviewCard
                    key={item.id}
                    item={item}
                    title={`Gallery image ${index + 1}`}
                    canMoveLeft={index > 0}
                    canMoveRight={index < galleryItems.length - 1}
                    onMoveLeft={() => updateGallery((current) => moveItem(current, index, index - 1))}
                    onMoveRight={() => updateGallery((current) => moveItem(current, index, index + 1))}
                    onRemove={() => handleRemoveGalleryItem(item.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed bg-slate-50 p-6 text-center">
                <Upload className="h-10 w-10 text-slate-400" />
                <div className="space-y-1">
                  <p className="font-semibold">No gallery images yet</p>
                  <p className="text-sm text-muted-foreground">{uploadHint || "Add supporting images for the product."}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {mediaError ? <p className="text-sm text-destructive">{mediaError}</p> : null}

      <div>
        <Button type="submit" disabled={isSubmitting || isProcessingMedia}>
          {isSubmitting || isProcessingMedia ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              {isProcessingMedia ? "Uploading images..." : "Saving..."}
            </>
          ) : (
            submitLabel || "Save product"
          )}
        </Button>
      </div>
    </form>
  );
}
