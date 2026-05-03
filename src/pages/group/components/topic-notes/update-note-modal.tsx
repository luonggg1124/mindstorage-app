import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";

import LoadingDots from "@/components/animate/loading-dots";
import Editor from "@/components/custom/editor";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUpdateNote } from "@/data/api/note";
import { toast } from "@/lib/toast";

export function UpdateNoteModal({
  open,
  onOpenChange,
  note,
  topicId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: { id: string; title: string; content: string } | null;
  topicId: string | null;
  onSuccess?: () => void;
}) {
  const updateNote = useUpdateNote();
  const [draft, setDraft] = useState({ title: "", summary: "" });

  useEffect(() => {
    if (open && note) {
      setDraft({ title: note.title, summary: note.content });
    }
  }, [open, note]);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!note || !topicId) return;
    const title = draft.title.trim();
    if (!title) return;

    try {
      const res = await updateNote.mutateAsync({
        id: note.id,
        title,
        content: draft.summary?.trim() || "",
        topicId,
      });
      if (res.response.status >= 400) return;
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Lỗi khi cập nhật note");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] min-h-0 min-w-0 max-w-[min(100vw-2rem,56rem)] flex-col overflow-hidden p-4 sm:max-w-[min(100vw-2rem,56rem)] sm:p-6">

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden overscroll-y-contain pr-0.5">
            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium" htmlFor="edit-note-modal-title">
                Tiêu đề
              </label>
              <input
                id="edit-note-modal-title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                disabled={updateNote.isPending}
                className="w-full min-w-0 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Ví dụ: Setup API"
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
                onChange={(summary) => setDraft((d) => ({ ...d, summary }))}
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 border-t border-border/60 pt-4 sm:flex-row sm:justify-end sm:gap-3 sm:border-t-0 sm:pt-0">
            {updateNote.error?.message ? (
              <div className="w-full rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 sm:mr-auto sm:w-auto">
                {updateNote.error.message}
              </div>
            ) : null}
            <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={updateNote.isPending}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={updateNote.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {updateNote.isPending ? (
                  <>
                    Đang lưu <LoadingDots />
                  </>
                ) : (
                  "Lưu"
                )}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
