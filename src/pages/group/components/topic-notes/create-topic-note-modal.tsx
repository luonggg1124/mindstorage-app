import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";

import Editor from "@/components/custom/editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateNote } from "@/data/api/note";
import { toast } from "@/lib/toast";

export function CreateTopicNoteModal({
  open,
  onOpenChange,
  topicId,
  topicName,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string | null;
  topicName?: string;
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
    if (!topicId) return;

    try {
      const res = await createNote.mutateAsync({
        title,
        content: draft.summary?.trim() || "",
        topicId,
        parentId: null,
      });
      if (res.response.status >= 400) return;
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Lỗi khi tạo note");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Tạo note</DialogTitle>
          <DialogDescription>
            Tạo note mới trong chủ đề{" "}
            <span className="font-medium text-foreground">{topicName ?? "—"}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="create-topic-note-title">
              Tiêu đề
            </label>
            <input
              id="create-topic-note-title"
              value={draft.title}
              onChange={(e) => setDraft((s) => ({ ...s, title: e.target.value }))}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Ví dụ: Setup API"
              required
              disabled={createNote.isPending}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="create-topic-note-summary">
              Mô tả ngắn
            </label>
            <Editor
              content={draft.summary}
              placeholder="Nhập mô tả ngắn"
              toolbarMaxLines={3}
              className="min-h-[200px]"
              onChange={(summary) => setDraft((s) => ({ ...s, summary }))}
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={createNote.isPending}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Hủy
            </button>
            {createNote.error?.message ? (
              <div className="mr-auto rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                {createNote.error.message}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={createNote.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {createNote.isPending ? "Đang tạo..." : "Tạo note"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
