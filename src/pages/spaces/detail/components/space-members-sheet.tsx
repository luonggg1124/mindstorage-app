import * as React from "react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ScrollInfinite from "@/components/custom/scroll-infinite";
import type { ISpaceMemberUserDto } from "@/data/api/space";
import { formatRelative } from "@/utils/date";

const SpaceMembersSheet = ({
  open,
  onOpenChange,
  q,
  onChangeQ,
  membersInfinite,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  q: string;
  onChangeQ: (q: string) => void;
  membersInfinite: {
    enabled: boolean;
    loading: boolean;
    fetchingNextPage: boolean;
    data: ISpaceMemberUserDto[];
    total: number;
    error: unknown;
    hasNextPage: boolean | undefined;
    fetchNextPage: () => void;
  };
}) => {
  React.useEffect(() => {
    if (!open) onChangeQ("");
  }, [open, onChangeQ]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[420px] border-white/10 bg-slate-950/80 px-4 py-4 text-slate-100 backdrop-blur sm:w-[520px]"
      >
        <SheetHeader className="p-0">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="min-w-0">
              <SheetTitle className="text-slate-100">Thành viên</SheetTitle>
              <p className="mt-1 text-xs text-slate-300/70">
                Tổng:{" "}
                <span className="font-medium text-slate-100">
                  {membersInfinite.total || membersInfinite.data.length}
                </span>
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <input
              value={q}
              onChange={(e) => onChangeQ(e.target.value)}
              placeholder="Tìm theo tên / username..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 outline-none"
              autoFocus
            />
          </div>

          <ScrollInfinite
            enabled={membersInfinite.enabled}
            hasNextPage={Boolean(membersInfinite.hasNextPage)}
            isFetchingNextPage={membersInfinite.fetchingNextPage}
            onLoadMore={() => membersInfinite.fetchNextPage()}
            className="h-[calc(100vh-12.5rem)] space-y-2 overflow-y-auto pr-1"
            endMessage={
              membersInfinite.data.length > 0 ? (
                <div className="py-2 text-center text-xs text-slate-300/60">Đã tải hết.</div>
              ) : null
            }
          >
            {membersInfinite.loading ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[72px] w-full animate-pulse rounded-xl border border-white/10 bg-white/5"
                  />
                ))}
              </div>
            ) : null}

            {membersInfinite.data.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-slate-100">
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt={m.fullName} className="size-full object-cover" />
                    ) : (
                      (m.fullName.trim()[0] ?? "U").toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-100">{m.fullName}</p>
                    <p className="truncate text-xs text-slate-300/70">@{m.username}</p>
                    <p className="mt-0.5 text-[11px] text-slate-300/60">Tham gia {formatRelative(m.joinedAt)}</p>
                  </div>
                </div>

                <span
                  className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200"
                  title="Vai trò"
                >
                  {m.role}
                </span>
              </div>
            ))}

            {!membersInfinite.loading && membersInfinite.data.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300/70">
                Chưa có thành viên nào.
              </div>
            ) : null}

            {membersInfinite.error ? (
              <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                {(membersInfinite.error as Error)?.message || "Lỗi khi tải danh sách thành viên."}
              </div>
            ) : null}
          </ScrollInfinite>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SpaceMembersSheet;

