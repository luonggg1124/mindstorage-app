import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteNoteConfirmDialog({
  open,
  onOpenChange,
  title,
  isPending,
  errorMessage,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  isPending: boolean;
  errorMessage?: string;
  onConfirm: () => void;
}) {
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
            disabled={isPending}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Hủy
          </button>
          {errorMessage ? (
            <div className="mr-auto rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
              {errorMessage}
            </div>
          ) : null}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {isPending ? "Đang xóa..." : "Xóa"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

