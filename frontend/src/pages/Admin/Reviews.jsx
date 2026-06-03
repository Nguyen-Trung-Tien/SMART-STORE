import { useMemo, useState } from "react";
import { EyeOff, Eye, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/table/DataTable";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAllReviews, useDeleteReview, useUpdateReviewStatus } from "@/hooks/api/useReview";
import { formatCurrency } from "@/lib/formatter";

export default function AdminReviewsPage() {
  const reviewsQuery = useAllReviews();
  const deleteReview = useDeleteReview();
  const updateStatus = useUpdateReviewStatus();
  
  const [selectedReview, setSelectedReview] = useState(null);
  const deleteDialog = useDisclosure(false);

  const rows = reviewsQuery.reviews || [];
  const columns = useMemo(
    () => [
      { key: "product", header: "Product", render: (row) => row.product?.name || "Unknown Product" },
      { key: "user", header: "User", render: (row) => row.user?.name || "Anonymous" },
      { key: "rating", header: "Rating", render: (row) => `${row.rating} ★` },
      { key: "comment", header: "Comment", render: (row) => <div className="max-w-[200px] truncate">{row.comment}</div> },
      { 
        key: "status", 
        header: "Status",
        render: (row) => {
          const colors = {
            published: "text-green-500",
            hidden: "text-amber-500",
            pending: "text-blue-500",
            rejected: "text-red-500"
          };
          return <span className={colors[row.status] || "text-gray-500"}>{row.status}</span>;
        }
      },
      {
        key: "actions",
        header: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            {row.status === "published" ? (
              <Button
                variant="outline"
                size="icon"
                title="Hide Review"
                onClick={async () => {
                  try {
                    await updateStatus.mutateAsync({ id: row._id, status: "hidden" });
                    toast.success("Review hidden");
                  } catch (e) {
                    toast.error("Failed to update status");
                  }
                }}
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                title="Publish Review"
                onClick={async () => {
                  try {
                    await updateStatus.mutateAsync({ id: row._id, status: "published" });
                    toast.success("Review published");
                  } catch (e) {
                    toast.error("Failed to update status");
                  }
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                setSelectedReview(row);
                deleteDialog.open();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [deleteDialog, updateStatus]
  );

  const handleDelete = async () => {
    try {
      await deleteReview.mutateAsync(selectedReview._id);
      toast.success("Review deleted.");
      deleteDialog.close();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to delete review.");
    }
  };

  return (
    <div className="space-y-8 page-enter">
      <PageHeader
        eyebrow="Admin Moderation"
        title="Manage Reviews"
        description="Moderate customer product reviews (hide or delete inappropriate content)."
      />
      <Card>
        <CardContent className="p-4">
          <DataTable columns={columns} rows={rows} />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(value) => (value ? deleteDialog.open() : deleteDialog.close())}
        title="Delete review"
        description={`This will permanently remove the review by ${selectedReview?.user?.name || "this user"}.`}
        onConfirm={handleDelete}
        loading={deleteReview.isPending}
      />
    </div>
  );
}
