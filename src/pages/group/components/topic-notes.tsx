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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ScrollInfinite from "@/components/custom/scroll-infinite";
import { useDebounce } from "@/hooks/use-debounce";
import type { INoteByTopicDto } from "@/data/api/note";
import { useCreateNote, useDeleteNote, useNotesByTopicInfinite } from "@/data/api/note";
import { toast } from "@/lib/toast";
import { sanitize } from "@/lib/dompurify";
import LoadingDots from "@/components/animate/loading-dots";

function safeInitials(value: string) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "U";
  return trimmed[0]?.toUpperCase() ?? "U";
}

type TopicNotesProps = {
  activeTopicId: number | null;
  activeTopicName?: string;
};

export function TopicNotes({ activeTopicId, activeTopicName }: TopicNotesProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", summary: "" });
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState({ title: "", summary: "" });
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [childDraft, setChildDraft] = useState({ title: "", summary: "" });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 500);

  const notesInfinite = useNotesByTopicInfinite({
    params: { topicId: activeTopicId },
    query: { q: debouncedQ, page: 1, size: 12 },
  });

  const notes = useMemo<INoteByTopicDto[]>(() => notesInfinite.data ?? [], [notesInfinite.data]);
  const selected = useMemo(() => notes.find((n) => n.id === selectedId) ?? null, [notes, selectedId]);

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = draft.title.trim();
    if (!title) return;
    if (!activeTopicId) return;

    createNote
      .mutateAsync({
        title,
        content: draft.summary?.trim() || "",
        topicId: activeTopicId,
        parentId: null,
      })
      .then((res) => {
        if (res.error) return;
        setDraft({ title: "", summary: "" });
        setIsCreateOpen(false);
        notesInfinite.invalidate();
      })
      .catch(() => {
        toast.error("Lỗi khi tạo note");
      });
  };

  const openNoteDetail = (note: INoteByTopicDto) => {
    setSelectedId(note.id);
    setIsEditing(false);
    setEditDraft({ title: note.title, summary: note.content });
    setIsAddChildOpen(false);
    setChildDraft({ title: "", summary: "" });
  };

  const handleSaveEdit = () => {
    // Fake: không lưu vào list, chỉ thoát edit mode.
    setIsEditing(false);
  };

  const handleDeleteSelected = () => {
    if (!selected) return;
    deleteNote
      .mutateAsync({ id: selected.id })
      .then((res) => {
        if (res.error) return;
        setIsDeleteConfirmOpen(false);
        setSelectedId(null);
        notesInfinite.invalidate();
      })
      .catch(() => {
        toast.error("Lỗi khi xóa ghi chú");
      });
  };

  const handleCreateChild = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = childDraft.title.trim();
    if (!title) return;
    if (!activeTopicId) return;
    if (!selected) return;

    createNote
      .mutateAsync({
        title,
        content: childDraft.summary?.trim() || "",
        topicId: activeTopicId,
        parentId: selected.id,
      })
      .then((res) => {
        if (res.error) return;
        setChildDraft({ title: "", summary: "" });
        setIsAddChildOpen(false);
        notesInfinite.invalidate();
      })
      .catch(() => {
        toast.error("Lỗi khi tạo ghi chú con");
      });
  };

  if (!activeTopicId) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-8 text-sm text-slate-300/80 backdrop-blur">
        Chọn một chủ đề để xem note.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-300/70">Chủ đề</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{activeTopicName ?? "—"}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Tạo note
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-10 w-full max-w-md rounded-full border border-white/15 bg-slate-900/40 px-4 text-sm text-slate-100 outline-none placeholder:text-slate-400 focus:border-primary"
            placeholder="Tìm note..."
            aria-label="Tìm note"
          />
          <span className="text-sm text-slate-300/80">
            Đang xem <span className="font-medium text-slate-100">{notes.length}</span> /{" "}
            <span className="font-medium text-slate-100">{notesInfinite.total || notes.length}</span>
          </span>
        </div>

        {notesInfinite.loading ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="h-5 w-1/2 animate-pulse rounded bg-white/10" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        ) : notesInfinite.error ? (
          <div className="mt-4 rounded-lg border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
            {(notesInfinite.error as Error)?.message || "Lỗi khi tải danh sách note."}
          </div>
        ) : notes.length > 0 ? (
          <ScrollInfinite
            enabled
            hasNextPage={Boolean(notesInfinite.hasNextPage)}
            isFetchingNextPage={notesInfinite.fetchingNextPage}
            onLoadMore={() => notesInfinite.fetchNextPage()}
            className="mt-4"
           
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-300/80">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex items-center gap-2">
                            <Avatar size="sm">
                              {n.creator.avatarUrl ? (
                                <AvatarImage src={n.creator.avatarUrl} alt={n.creator.username} />
                              ) : null}
                              <AvatarFallback>{safeInitials(n.creator.username)}</AvatarFallback>
                            </Avatar>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={6}>@{n.creator.username}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-300/85">{sanitize(n.content, 180) || "—"}</p>
                </button>
              ))}
            </div>

            {notesInfinite.fetchingNextPage ? (
              <div className="mt-4 text-center text-sm text-slate-300/80">Đang tải thêm…</div>
            ) : null}
          </ScrollInfinite>
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
              Tạo note mới trong chủ đề <span className="font-medium text-foreground">{activeTopicName ?? "—"}</span>.
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

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null);
            setIsEditing(false);
            setIsDeleteConfirmOpen(false);
          }
        }}
      >
        {selected ? (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl border-white/10 bg-slate-950/80 text-slate-100 backdrop-blur">
            <DialogHeader>
              <DialogTitle>Chi tiết note</DialogTitle>
              <DialogDescription>
                <span className="text-slate-300/80">
                  Thuộc chủ đề <span className="font-medium text-foreground">{activeTopicName ?? "—"}</span> · Cập nhật{" "}
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
                            {selected.creator.avatarUrl ? (
                              <AvatarImage src={selected.creator.avatarUrl} alt={selected.creator.username} />
                            ) : null}
                            <AvatarFallback>{safeInitials(selected.creator.username)}</AvatarFallback>
                          </Avatar>
                        
                        </div>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6}>@{selected.creator.username}</TooltipContent>
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
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/15 disabled:opacity-60"
                    disabled={deleteNote.isPending}
                  >
                    {deleteNote.isPending ? "Đang xóa..." : "Xóa ghi chú này"}
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
                  <div className="max-w-none whitespace-pre-wrap wrap-break-word text-sm text-slate-200/90">
                    {sanitize(selected.content) || "—"}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        ) : null}
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa ghi chú?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Bạn có chắc muốn xóa ghi chú{" "}
              <span className="font-medium text-foreground">{selected?.title ?? "—"}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={deleteNote.isPending}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Hủy
            </button>
            {deleteNote.error?.message ? (
              <div className="mr-auto rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
                {deleteNote.error.message}
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={deleteNote.isPending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
            >
              {deleteNote.isPending ? "Đang xóa..." : "Xóa"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddChildOpen} onOpenChange={setIsAddChildOpen}>
        <DialogContent className="sm:max-w-xl">
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
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
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
                disabled={createNote.isPending}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Hủy
              </button>
              {createNote.error?.message ? (
                <div className="mr-auto rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
                  {createNote.error.message}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={createNote.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                {createNote.isPending ? <>Đang tạo <LoadingDots/></> : "Tạo"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
