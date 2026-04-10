import type { FormEvent } from "react";

import LoadingDots from "@/components/animate/loading-dots";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EditTopicModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: { name: string };
  onChange: (next: { name: string }) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
};

export function EditTopicModal({ open, onOpenChange, value, onChange, onSubmit, isPending = false }: EditTopicModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Sửa chủ đề</DialogTitle>
          <DialogDescription>Cập nhật tên chủ đề. (Tạm thời chỉ lưu UI, chưa gọi API)</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="edit-topic-name">
              Tên chủ đề
            </label>
            <input
              id="edit-topic-name"
              value={value.name}
              onChange={(e) => onChange({ name: e.target.value })}
              disabled={isPending}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Ví dụ: Backend, Frontend"
              required
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

