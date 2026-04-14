import type { FormEvent } from "react";

import LoadingDots from "@/components/animate/loading-dots";
import Editor from "@/components/custom/editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UpdateNoteModal({
  open,
  onOpenChange,
  value,
  onChange,
  isPending,
  errorMessage,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: { title: string; summary: string };
  onChange: (next: { title: string; summary: string }) => void;
  isPending: boolean;
  errorMessage?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Sửa note</DialogTitle>
          <DialogDescription>
            Cập nhật nội dung cho note <span className="font-medium text-foreground">{value.title || "—"}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="edit-note-modal-title">
              Tiêu đề
            </label>
            <input
              id="edit-note-modal-title"
              value={value.title}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
              disabled={isPending}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Ví dụ: Setup API"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Mô tả</label>
            <Editor
              content={value.summary}
              placeholder="Nhập mô tả"
              toolbarMaxLines={3}
              className="min-h-[220px]"
              onChange={(summary) => onChange({ ...value, summary })}
            />
          </div>

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
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? (
                <>
                  Đang lưu <LoadingDots />
                </>
              ) : (
                "Lưu"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

