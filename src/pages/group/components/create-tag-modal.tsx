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

type CreateTagModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  name: string;
  onNameChange: (next: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  errorMessage?: string;
};

export function CreateTagModal({
  open,
  onOpenChange,
  groupName,
  name,
  onNameChange,
  onSubmit,
  isPending,
  errorMessage,
}: CreateTagModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Tạo thẻ</DialogTitle>
          <DialogDescription>
            Thêm một thẻ mới cho group <span className="font-medium text-foreground">{groupName}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="create-tag-name">
              Tên thẻ
            </label>
            <input
              id="create-tag-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              disabled={isPending}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Ví dụ: Backend, Frontend"
              required
            />
          </div>

          {errorMessage ? (
            <div className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
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
              disabled={isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {isPending ? (
                <>
                  Đang tạo <LoadingDots />
                </>
              ) : (
                "Tạo thẻ"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

