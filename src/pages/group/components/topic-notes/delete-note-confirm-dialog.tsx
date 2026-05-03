import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteNote } from "@/data/api/note";
import { toast } from "@/lib/toast";

export function DeleteNoteConfirmDialog({
  open,
  onOpenChange,
  noteId,
  title,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteId: string | null;
  title: string;
  /** Sau khi xóa thành công (đóng dialog trước khi gọi). */
  onDeleted?: () => void;
}) {
  const deleteNote = useDeleteNote();

  const handleConfirm = async () => {
    if (!noteId) return;
    try {
      const res = await deleteNote.mutateAsync({ id: noteId });
      if (res.response.status >= 400) return;
      onOpenChange(false);
      onDeleted?.();
    } catch {
      toast.error("Lỗi khi xóa ghi chú");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xóa ghi chú?</DialogTitle>
          <DialogDescription>
            Hành động này không thể hoàn tác. Bạn có chắc muốn xóa ghi chú{" "}
            <span className="font-medium text-foreground">{title || "—"}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={deleteNote.isPending}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Hủy
          </button>
          {deleteNote.error?.message ? (
            <div className="mr-auto rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
              {deleteNote.error.message}
            </div>
          ) : null}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleteNote.isPending || !noteId}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {deleteNote.isPending ? "Đang xóa..." : "Xóa"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
