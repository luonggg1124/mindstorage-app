import { FormEvent, useEffect, useMemo, useState } from "react";

import LoadingDots from "@/components/animate/loading-dots";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EditSpaceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue: {
    name: string;
    description?: string | null;
  };
  onSubmit: (value: { name: string; description: string }) => Promise<void> | void;
  isPending?: boolean;
  errorMessage?: string;
};

export function EditSpaceModal({
  open,
  onOpenChange,
  initialValue,
  onSubmit,
  isPending = false,
  errorMessage,
}: EditSpaceModalProps) {
  const [draft, setDraft] = useState({ name: "", description: "" });

  useEffect(() => {
    if (!open) return;
    setDraft({
      name: initialValue.name ?? "",
      description: initialValue.description ?? "",
    });
  }, [open, initialValue.name, initialValue.description]);

  const canSubmit = useMemo(() => draft.name.trim().length > 0 && !isPending, [draft.name, isPending]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) return;
    // description được phép để trống
    await onSubmit({ name, description: (draft.description ?? "").trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Sửa space</DialogTitle>
          <DialogDescription>Cập nhật tên và mô tả cho space.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="edit-space-name">
              Tên space
            </label>
            <input
              id="edit-space-name"
              value={draft.name}
              onChange={(e) => setDraft((s) => ({ ...s, name: e.target.value }))}
              disabled={isPending}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Ví dụ: Mobile App Team"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="edit-space-desc">
              Mô tả (không bắt buộc)
            </label>
            <textarea
              id="edit-space-desc"
              value={draft.description}
              onChange={(e) => setDraft((s) => ({ ...s, description: e.target.value }))}
              disabled={isPending}
              className="min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Mô tả ngắn về mục đích của space"
            />
          </div>

          {errorMessage ? (
            <div className="rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              {errorMessage}
            </div>
          ) : null}

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
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

