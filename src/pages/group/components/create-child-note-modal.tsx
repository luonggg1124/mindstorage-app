import { FormEvent, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Editor from "@/components/custom/editor";

type ChildNoteDraft = {
  parentId: string;
  title: string;
  summary: string;
};

type CreateChildNoteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: Array<{ id: string; title: string }>;
  value: ChildNoteDraft;
  onChange: (next: ChildNoteDraft) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function CreateChildNoteModal({
  open,
  onOpenChange,
  notes,
  value,
  onChange,
  onSubmit,
}: CreateChildNoteModalProps) {
  const [search, setSearch] = useState("");

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => n.title.toLowerCase().includes(q));
  }, [notes, search]);

  const notesForSelect = useMemo(() => {
    const selected = notes.find((n) => n.id === value.parentId) ?? null;
    if (!selected) return filteredNotes;
    if (filteredNotes.some((n) => n.id === selected.id)) return filteredNotes;
    return [selected, ...filteredNotes];
  }, [filteredNotes, notes, value.parentId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Thêm note</DialogTitle>
          <DialogDescription>Chọn thẻ và nhập thông tin note cần thêm.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Chọn thẻ</label>
            <select
              value={value.parentId}
              onChange={(event) => onChange({ ...value, parentId: event.target.value })}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {notesForSelect.length > 0 ? (
                notesForSelect.map((note) => (
                  <option key={note.id} value={note.id}>
                    {note.title}
                  </option>
                ))
              ) : (
                <option value={value.parentId || ""} disabled>
                  Không tìm thấy note phù hợp
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Tên note</label>
            <input
              value={value.title}
              onChange={(event) => onChange({ ...value, title: event.target.value })}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Nhập tên note"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Mô tả ngắn</label>
            <Editor
              content={value.summary}
              placeholder="Nhập mô tả ngắn cho note"
              toolbarMaxLines={2}
              className="min-h-[200px]"
              onChange={(summary) => onChange({ ...value, summary })}
            />
          </div>

          <DialogFooter>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mr-auto h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary sm:w-[240px]"
              placeholder="Tìm note..."
              aria-label="Tìm note"
            />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Tạo note
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

