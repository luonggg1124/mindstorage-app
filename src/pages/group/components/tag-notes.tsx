import { FormEvent, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatRelative } from "@/utils/date";
import Editor from "@/components/custom/editor";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type FakeNote = {
  id: string;
  title: string;
  summary: string;
  updatedAt: string;
  createdBy: {
    username: string;
    fullName: string;
  };
  children: Array<{
    id: string;
    title: string;
    summary: string;
    updatedAt: string;
    createdBy: {
      username: string;
      fullName: string;
    };
  }>;
};

function buildFakeNotes(tagId: number): FakeNote[] {
  const now = Date.now();
  const base = tagId % 1000;
  return [
    {
      id: `note-${base}-1`,
      title: `Ghi chú ${base}-1`,
      summary: "Tóm tắt ngắn cho note (fake) để demo UI theo thẻ.",
      updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
      createdBy: { username: "linh.ng", fullName: "Linh Nguyễn" },
      children: [
        {
          id: `child-${base}-1`,
          title: "Ghi chú con A",
          summary: "Một ghi chú con (fake).",
          updatedAt: new Date(now - 50 * 60 * 1000).toISOString(),
          createdBy: { username: "nam.tr", fullName: "Nam Trần" },
        },
      ],
    },
    {
      id: `note-${base}-2`,
      title: `Ghi chú ${base}-2`,
      summary: "Một note khác (fake). Sau này sẽ thay bằng API notes-by-tag.",
      updatedAt: new Date(now - 26 * 60 * 60 * 1000).toISOString(), // yesterday-ish
      createdBy: { username: "hoa.pt", fullName: "Hòa Phạm" },
      children: [],
    },
    {
      id: `note-${base}-3`,
      title: `Ghi chú ${base}-3`,
      summary: "Note (fake) để thấy layout danh sách và modal tạo note.",
      updatedAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      createdBy: { username: "minh.le", fullName: "Minh Lê" },
      children: [
        {
          id: `child-${base}-2`,
          title: "Ghi chú con B",
          summary: "Ghi chú con (fake) số 2.",
          updatedAt: new Date(now - 9 * 60 * 60 * 1000).toISOString(),
          createdBy: { username: "linh.ng", fullName: "Linh Nguyễn" },
        },
        {
          id: `child-${base}-3`,
          title: "Ghi chú con C",
          summary: "Ghi chú con (fake) số 3.",
          updatedAt: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: { username: "hoa.pt", fullName: "Hòa Phạm" },
        },
      ],
    },
  ];
}

type TagNotesProps = {
  activeTagId: number | null;
  activeTagName?: string;
};

export function TagNotes({ activeTagId, activeTagName }: TagNotesProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", summary: "" });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState({ title: "", summary: "" });
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [childDraft, setChildDraft] = useState({ title: "", summary: "" });
  const notes = useMemo(() => {
    if (!activeTagId) return [];
    return buildFakeNotes(activeTagId);
  }, [activeTagId]);
  const selected = useMemo(() => notes.find((n) => n.id === selectedId) ?? null, [notes, selectedId]);

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = draft.title.trim();
    if (!title) return;
    // Fake: chỉ đóng modal. Khi có API thì gọi create-note(tagId, title, summary)
    setDraft({ title: "", summary: "" });
    setIsCreateOpen(false);
  };

  const openNoteDetail = (note: FakeNote) => {
    setSelectedId(note.id);
    setIsEditing(false);
    setEditDraft({ title: note.title, summary: note.summary });
    setIsAddChildOpen(false);
    setChildDraft({ title: "", summary: "" });
  };

  const handleSaveEdit = () => {
    // Fake: không lưu vào list, chỉ thoát edit mode.
    setIsEditing(false);
  };

  const handleCreateChild = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = childDraft.title.trim();
    if (!title) return;
    // Fake: không lưu vào list, chỉ đóng modal
    setChildDraft({ title: "", summary: "" });
    setIsAddChildOpen(false);
  };

  if (!activeTagId) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-8 text-sm text-slate-300/80 backdrop-blur">
        Chọn một thẻ để xem note.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-300/70">Thẻ</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{activeTagName ?? "—"}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Tạo note
          </button>
        </div>

        {notes.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {notes.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => openNoteDetail(n)}
                className="text-left rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate font-semibold text-slate-100">{n.title}</p>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300/80">
                    {formatRelative(n.updatedAt, "—")}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-slate-300/85">{n.summary}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300/80">
            Chưa có note nào.
          </div>
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Tạo note</DialogTitle>
            <DialogDescription>
              Tạo note mới trong thẻ <span className="font-medium text-foreground">{activeTagName ?? "—"}</span>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="create-note-title">
                Tiêu đề
              </label>
              <input
                id="create-note-title"
                value={draft.title}
                onChange={(e) => setDraft((s) => ({ ...s, title: e.target.value }))}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Ví dụ: Setup API"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="create-note-summary">
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
                onClick={() => setIsCreateOpen(false)}
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

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null);
            setIsEditing(false);
          }
        }}
      >
        {selected ? (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl border-white/10 bg-slate-950/80 text-slate-100 backdrop-blur">
            <DialogHeader>
              <DialogTitle>Chi tiết note</DialogTitle>
              <DialogDescription>
                <span className="text-slate-300/80">
                  Thuộc thẻ <span className="font-medium text-foreground">{activeTagName ?? "—"}</span> · Cập nhật{" "}
                  {formatRelative(selected.updatedAt, "—")}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-300/80">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-flex items-center gap-2">
                          <Avatar size="sm">
                            <AvatarFallback>{selected.createdBy.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-slate-200">{selected.createdBy.fullName}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6}>@{selected.createdBy.username}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddChildOpen(true)}
                    className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    Thêm ghi chú con
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing((v) => !v)}
                    className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
                  >
                    {isEditing ? "Đóng sửa" : "Sửa"}
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div>
                    <label className="mb-1 block text-sm font-medium" htmlFor="edit-note-title">
                      Tên note
                    </label>
                    <input
                      id="edit-note-title"
                      value={editDraft.title}
                      onChange={(e) => setEditDraft((s) => ({ ...s, title: e.target.value }))}
                      className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Mô tả</label>
                    <Editor
                      content={editDraft.summary}
                      placeholder="Nhập mô tả"
                      toolbarMaxLines={2}
                      className="min-h-[220px]"
                      onChange={(summary) => setEditDraft((s) => ({ ...s, summary }))}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200/90 backdrop-blur">
                  <p className="mb-2 text-base font-semibold text-slate-100">{selected.title}</p>
                  <div className="prose prose-invert max-w-none text-sm">
                    <div dangerouslySetInnerHTML={{ __html: selected.summary }} />
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-100">Ghi chú con</p>
                  <span className="text-xs text-slate-300/70">{selected.children.length} mục</span>
                </div>

                {selected.children.length > 0 ? (
                  <ul className="space-y-3">
                    {selected.children.map((c) => (
                      <li key={c.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-100">{c.title}</p>
                            <p className="mt-1 line-clamp-2 text-xs text-slate-300/80">{c.summary}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <Avatar size="sm">
                                      <AvatarFallback>{c.createdBy.fullName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent sideOffset={6}>@{c.createdBy.username}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300/80">
                              {formatRelative(c.updatedAt, "—")}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-lg border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300/80">
                    Chưa có ghi chú con.
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>

      <Dialog open={isAddChildOpen} onOpenChange={setIsAddChildOpen}>
        <DialogContent className="sm:max-w-xl border-white/10 bg-slate-950/80 text-slate-100 backdrop-blur">
          <DialogHeader>
            <DialogTitle>Thêm ghi chú con</DialogTitle>
            <DialogDescription>
              Thêm ghi chú con cho note <span className="font-medium text-foreground">{selected?.title ?? "—"}</span>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateChild} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="create-child-title">
                Tiêu đề
              </label>
              <input
                id="create-child-title"
                value={childDraft.title}
                onChange={(e) => setChildDraft((s) => ({ ...s, title: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-indigo-400"
                placeholder="Ví dụ: Checklist"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Mô tả</label>
              <Editor
                content={childDraft.summary}
                placeholder="Nhập mô tả"
                toolbarMaxLines={2}
                className="min-h-[200px]"
                onChange={(summary) => setChildDraft((s) => ({ ...s, summary }))}
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsAddChildOpen(false)}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Tạo
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

