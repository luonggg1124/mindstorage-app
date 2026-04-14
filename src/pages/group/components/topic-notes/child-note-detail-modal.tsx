import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatRelative } from "@/utils/date";
import { sanitize } from "@/lib/dompurify";

export function ChildNoteDetailModal({
  open,
  onOpenChange,
  note,
  safeInitials,
  onEdit,
  onDelete,
  deletePending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: null | {
    id: number;
    title: string;
    content: string;
    updatedAt: string;
    creator: { username: string; avatarUrl: string | null };
  };
  safeInitials: (value: string) => string;
  onEdit: () => void;
  onDelete: () => void;
  deletePending: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {note ? (
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl border-white/10 bg-slate-950/80 text-slate-100 backdrop-blur">
          <DialogHeader>
            <DialogTitle>Chi tiết ghi chú con</DialogTitle>
            <DialogDescription>
              <span className="text-slate-300/80">Cập nhật {formatRelative(note.updatedAt, "—")}</span>
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
                          {note.creator.avatarUrl ? (
                            <AvatarImage src={note.creator.avatarUrl} alt={note.creator.username} />
                          ) : null}
                          <AvatarFallback>{safeInitials(note.creator.username)}</AvatarFallback>
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
                  onClick={onDelete}
                  className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/15 disabled:opacity-60"
                  disabled={deletePending}
                >
                  {deletePending ? "Đang xóa..." : "Xóa ghi chú này"}
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

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200/90 backdrop-blur">
              <p className="mb-2 text-base font-semibold text-slate-100">{note.title}</p>
              <div className="max-w-none whitespace-pre-wrap wrap-break-word text-sm text-slate-200/90">
                {sanitize(note.content) || "—"}
              </div>
            </div>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

