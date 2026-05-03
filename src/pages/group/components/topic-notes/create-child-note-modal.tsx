import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";

import LoadingDots from "@/components/animate/loading-dots";
import Editor from "@/components/custom/editor";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCreateNote } from "@/data/api/note";
import { toast } from "@/lib/toast";

export function CreateChildNoteModal({
  open,
  onOpenChange,
  topicId,
  parentId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string | null;
  parentId: string | null;
  onSuccess?: () => void;
}) {
  const createNote = useCreateNote();
  const [draft, setDraft] = useState({ title: "", summary: "" });

  useEffect(() => {
    if (open) {
      setDraft({ title: "", summary: "" });
    }
  }, [open]);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = draft.title.trim();
    if (!title) return;
    if (!topicId || !parentId) return;

    try {
      const res = await createNote.mutateAsync({
        title,
        content: draft.summary?.trim() || "",
        topicId,
        parentId,
      });
      if (res.response.status >= 400) return;
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Lỗi khi tạo ghi chú con");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] min-h-0 min-w-0 max-w-[min(100vw-2rem,56rem)] flex-col overflow-hidden p-4 sm:max-w-[min(100vw-2rem,56rem)] sm:p-6">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden overscroll-y-contain pr-0.5">
            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium" htmlFor="create-child-title">
                Tiêu đề
              </label>
              <input
                id="create-child-title"
                value={draft.title}
                onChange={(e) => setDraft((s) => ({ ...s, title: e.target.value }))}
                disabled={createNote.isPending}
                className="w-full min-w-0 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Ví dụ: Checklist"
                required
              />
            </div>

            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium">Mô tả</label>
              <Editor
                content={draft.summary}
                placeholder="Nhập mô tả"
                toolbarMaxLines={3}
                className="min-h-[220px] w-full min-w-0 max-w-full"
                onChange={(summary) => setDraft((s) => ({ ...s, summary }))}
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 border-t border-border/60 pt-4 sm:flex-row sm:justify-end sm:gap-3 sm:border-t-0 sm:pt-0">
            {createNote.error?.message ? (
              <div className="w-full rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 sm:mr-auto sm:w-auto">
                {createNote.error.message}
              </div>
            ) : null}
            <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={createNote.isPending}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={createNote.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {createNote.isPending ? (
                  <>
                    Đang tạo <LoadingDots />
                  </>
                ) : (
                  "Tạo"
                )}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
