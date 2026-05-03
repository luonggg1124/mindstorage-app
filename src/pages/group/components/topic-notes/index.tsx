import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatRelative } from "@/utils/date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ScrollInfinite from "@/components/custom/scroll-infinite";
import { useDebounce } from "@/hooks/use-debounce";
import type { INoteByParentDto, INoteByTopicDto } from "@/data/api/note";
import { useNotesByParentInfinite, useNotesByTopicInfinite } from "@/data/api/note";
import { sanitizeHtml, sanitizeText } from "@/lib/dompurify";

import { ChildNoteDetailModal } from "./child-note-detail-modal";
import { CreateChildNoteModal } from "./create-child-note-modal";
import { CreateTopicNoteModal } from "./create-topic-note-modal";
import { DeleteNoteConfirmDialog } from "./delete-note-confirm-dialog";
import { UpdateNoteModal } from "./update-note-modal";

function safeInitials(value: string) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "U";
  return trimmed[0]?.toUpperCase() ?? "U";
}

function noteListExcerpt(html: string, maxLen = 320): string {
  return sanitizeText(html ?? "", maxLen).replace(/\s+/g, " ").trim();
}

type TopicNotesProps = {
  activeTopicId: string | null;
  activeTopicName?: string;
};

const TopicNotes = ({ activeTopicId, activeTopicName }: TopicNotesProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailNoteId, setDetailNoteId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<INoteByParentDto | null>(null);
  const [editTarget, setEditTarget] = useState<{ id: string; title: string; content: string } | null>(null);

  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 500);

  const notesInfinite = useNotesByTopicInfinite({
    params: { topicId: activeTopicId },
    query: { q: debouncedQ, page: 1, size: 12 },
  });

  const notes = useMemo<INoteByTopicDto[]>(() => notesInfinite.data ?? [], [notesInfinite.data]);

  const selected = useMemo(
    () => (detailNoteId ? notes.find((n) => n.id === detailNoteId) ?? null : null),
    [notes, detailNoteId]
  );

  const childNotesInfinite = useNotesByParentInfinite({
    params: { parentId: selected?.id ?? null },
    query: { page: 1, size: 12 },
  });

  useEffect(() => {
    setIsCreateOpen(false);
    setDetailNoteId(null);
    setDeleteTarget(null);
    setIsAddChildOpen(false);
    setSelectedChild(null);
    setEditTarget(null);
  }, [activeTopicId]);

  const closeDetailShell = () => {
    setDetailNoteId(null);
    setDeleteTarget(null);
    setIsAddChildOpen(false);
    setSelectedChild(null);
    setEditTarget(null);
  };

  const deleteParentOpen = Boolean(deleteTarget);
  const updateModalOpen = Boolean(editTarget);

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
            endMessage={
              <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-center text-sm text-slate-300/80">
                Bạn đã xem tất cả{" "}
                <span className="font-medium text-slate-100">{notesInfinite.total || notes.length}</span> note.
              </div>
            }
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {notes.map((n) => {
                const excerpt = noteListExcerpt(n.content);
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setDetailNoteId(n.id)}
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
                    {excerpt ? (
                      <p className="mt-2 line-clamp-3 text-sm text-slate-300/85">{excerpt}</p>
                    ) : (
                      <p className="mt-2 line-clamp-3 text-sm text-slate-300/85">—</p>
                    )}
                  </button>
                );
              })}
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

      <CreateTopicNoteModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        topicId={activeTopicId}
        topicName={activeTopicName}
        onSuccess={() => notesInfinite.invalidate()}
      />

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) closeDetailShell();
        }}
      >
        {selected ? (
          <DialogContent className="flex min-w-0 max-h-[90vh] w-full max-w-[min(100vw-2rem,90rem)] flex-col overflow-hidden border-white/10 bg-slate-950/80 p-6 text-slate-100 backdrop-blur sm:max-w-7xl">
            <DialogHeader className="shrink-0 space-y-2">
              <DialogTitle>Chi tiết note</DialogTitle>
              <DialogDescription>
                <span className="text-slate-300/80">
                  Thuộc chủ đề <span className="font-medium text-foreground">{activeTopicName ?? "—"}</span> · Cập nhật{" "}
                  {formatRelative(selected.updatedAt, "—")}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 grid min-h-0 max-h-[min(78vh,calc(90vh-10rem))] min-w-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] gap-y-4 overflow-hidden md:grid-cols-12 md:grid-rows-[minmax(0,1fr)] md:items-stretch md:gap-x-6 md:gap-y-0">
              <div className="col-span-12 flex min-h-0 w-full min-w-0 flex-col overflow-hidden md:col-span-7 md:min-h-0">
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 pb-3">
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
                      onClick={() => setDeleteTarget({ id: selected.id, title: selected.title })}
                      className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/15"
                    >
                      Xóa ghi chú này
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditTarget({
                          id: selected.id,
                          title: selected.title,
                          content: selected.content,
                        })
                      }
                      className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
                    >
                      Sửa
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain pr-0.5 md:pr-1">
                  <div className="w-full min-w-0 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200/90 backdrop-blur">
                    <p className="mb-2 text-base font-semibold text-slate-100">{selected.title}</p>
                    {sanitizeHtml(selected.content) ? (
                      <div
                        className="prose prose-invert w-full max-w-none text-sm text-slate-200/90 prose-p:my-2 prose-img:max-w-full prose-a:text-sky-300"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(selected.content) }}
                      />
                    ) : (
                      <div className="text-sm text-slate-200/90">—</div>
                    )}
                  </div>
                </div>
              </div>

              <aside className="col-span-12 flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 pt-4 backdrop-blur max-h-[min(68vh,calc(90vh-10rem))] md:col-span-5 md:max-h-[min(70vh,calc(90vh-9rem))] md:border-l md:border-t-0 md:pt-0 md:pl-6">
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-3 pt-2 md:pt-3">
                  <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <p className="text-sm font-semibold text-slate-100">Ghi chú con</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-300/70">
                        {childNotesInfinite.total || childNotesInfinite.data.length} mục
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddChildOpen(true)}
                        className="inline-flex shrink-0 rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-indigo-400"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain pr-0.5 [-webkit-overflow-scrolling:touch] touch-pan-y">
                    {childNotesInfinite.loading ? (
                      <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-3">
                            <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
                            <div className="mt-2 h-3 w-full animate-pulse rounded bg-white/10" />
                            <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-white/10" />
                          </div>
                        ))}
                      </div>
                    ) : childNotesInfinite.error ? (
                      <div className="rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">
                        {(childNotesInfinite.error as Error)?.message || "Lỗi khi tải ghi chú con."}
                      </div>
                    ) : childNotesInfinite.data.length > 0 ? (
                      <ScrollInfinite
                        enabled
                        hasNextPage={Boolean(childNotesInfinite.hasNextPage)}
                        isFetchingNextPage={childNotesInfinite.fetchingNextPage}
                        onLoadMore={() => childNotesInfinite.fetchNextPage()}
                        className="space-y-3"
                        endMessage={
                          <div className="rounded-lg border border-dashed border-white/15 bg-white/5 p-3 text-center text-xs text-slate-300/80">
                            Bạn đã xem hết ghi chú con.
                          </div>
                        }
                      >
                        <div className="flex flex-col gap-3">
                          {childNotesInfinite.data.map((c: INoteByParentDto) => {
                            const childExcerpt = noteListExcerpt(c.content, 200);
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => setSelectedChild(c)}
                                className="text-left rounded-lg border border-white/10 bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/[0.07]"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-100">{c.title}</p>
                                    {childExcerpt ? (
                                      <p className="mt-1 line-clamp-2 text-xs text-slate-300/80">{childExcerpt}</p>
                                    ) : (
                                      <p className="mt-1 line-clamp-2 text-xs text-slate-300/80">—</p>
                                    )}
                                  </div>
                                  <div className="flex shrink-0 items-center gap-2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div>
                                            <Avatar size="sm">
                                              {c.creator.avatarUrl ? (
                                                <AvatarImage src={c.creator.avatarUrl} alt={c.creator.username} />
                                              ) : null}
                                              <AvatarFallback>{safeInitials(c.creator.username)}</AvatarFallback>
                                            </Avatar>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent sideOffset={6}>@{c.creator.username}</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300/80">
                                      {formatRelative(c.updatedAt, "—")}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </ScrollInfinite>
                    ) : (
                      <div className="rounded-lg border border-dashed border-white/15 bg-white/5 p-3 text-sm text-slate-300/80">
                        Chưa có ghi chú con.
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>

      <DeleteNoteConfirmDialog
        open={deleteParentOpen}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        noteId={deleteTarget?.id ?? null}
        title={deleteTarget?.title ?? ""}
        onDeleted={() => {
          setDeleteTarget(null);
          closeDetailShell();
          notesInfinite.invalidate();
        }}
      />

      <UpdateNoteModal
        open={updateModalOpen}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        note={editTarget}
        topicId={activeTopicId}
        onSuccess={() => {
          notesInfinite.invalidate();
          childNotesInfinite.invalidate();
          setEditTarget(null);
        }}
      />

      <ChildNoteDetailModal
        open={Boolean(selectedChild)}
        onOpenChange={(open) => {
          if (!open) setSelectedChild(null);
        }}
        note={selectedChild}
        onEdit={() => {
          if (!selectedChild) return;
          setEditTarget({
            id: selectedChild.id,
            title: selectedChild.title,
            content: selectedChild.content,
          });
        }}
        onDeleted={() => {
          setSelectedChild(null);
          childNotesInfinite.invalidate();
        }}
      />

      <CreateChildNoteModal
        open={isAddChildOpen}
        onOpenChange={setIsAddChildOpen}
        topicId={activeTopicId}
        parentId={selected?.id ?? null}
        onSuccess={() => {
          notesInfinite.invalidate();
          childNotesInfinite.invalidate();
          setIsAddChildOpen(false);
        }}
      />
    </>
  );
};

export default TopicNotes;
