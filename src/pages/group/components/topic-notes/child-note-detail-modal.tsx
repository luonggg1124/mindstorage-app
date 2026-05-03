import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { INoteByParentDto } from "@/data/api/note";
import { formatRelative } from "@/utils/date";
import { sanitizeHtml } from "@/lib/dompurify";

import { DeleteNoteConfirmDialog } from "./delete-note-confirm-dialog";

function noteInitials(value: string) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "U";
  return trimmed[0]?.toUpperCase() ?? "U";
}

export function ChildNoteDetailModal({
  open,
  onOpenChange,
  note,
  onEdit,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: INoteByParentDto | null;
  onEdit: () => void;
  onDeleted?: () => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {note ? (
          <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-2xl border-white/10 bg-slate-950/80 text-slate-100 backdrop-blur">
            <DialogHeader className="shrink-0">
              <DialogTitle>Chi tiết ghi chú con</DialogTitle>
              <DialogDescription>
                <span className="text-slate-300/80">Cập nhật {formatRelative(note.updatedAt, "—")}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 pb-3">
                <div className="flex items-center gap-2 text-xs text-slate-300/80">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-flex items-center gap-2">
                          <Avatar size="sm">
                            {note.creator.avatarUrl ? (
                              <AvatarImage src={note.creator.avatarUrl} alt={note.creator.username} />
                            ) : null}
                            <AvatarFallback>{noteInitials(note.creator.username)}</AvatarFallback>
                          </Avatar>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6}>@{note.creator.username}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteOpen(true)}
                    className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/15"
                  >
                    Xóa ghi chú này
                  </button>
                  <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
                  >
                    Sửa
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain pr-0.5">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200/90 backdrop-blur">
                  <p className="mb-2 text-base font-semibold text-slate-100">{note.title}</p>
                  {sanitizeHtml(note.content) ? (
                    <div
                      className="prose prose-invert max-w-none text-sm text-slate-200/90 prose-p:my-2 prose-a:text-sky-300"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content) }}
                    />
                  ) : (
                    <div className="text-sm text-slate-200/90">—</div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>

      <DeleteNoteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        noteId={note?.id ?? null}
        title={note?.title ?? ""}
        onDeleted={() => {
          onOpenChange(false);
          onDeleted?.();
        }}
      />
    </>
  );
}
